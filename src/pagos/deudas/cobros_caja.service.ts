import { DeudaRequestDto } from './dto/request/deuda-request.dto';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PagosDeudasRepository } from 'src/common/repository/pagos/pagos.deudas.repository';
import { DeudaResponseDto } from './dto/response/deuda-response.dto';
import { FuncionesFechas } from '../../common/utils/funciones.fechas';
import { DatosClienteResponseDto } from './dto/response/datos-cliente-response.dto';
import { FuncionesGenerales } from 'src/common/utils/funciones.generales';

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { PagosTransaccionesRepository } from 'src/common/repository/pagos/pagos.transacciones.repository';
import { IDatabase } from 'pg-promise';
import { PagosTransaccionDeudaRepository } from 'src/common/repository/pagos/pagos.transaccion_deuda.repository';
import { IsipassGraphqlService } from 'src/common/external-services/isipass.graphql.service';
import { PagosComprobanteFacturaRepository } from 'src/common/repository/pagos/pagos.comprobante_factura.repository';

@Injectable()
export class CobrosCajaService {
  private storePath = path.posix.join(process.cwd(), 'store');

  constructor(
    private readonly pagosDeudasRepository: PagosDeudasRepository,
    private readonly pagosTransaccionesRepository: PagosTransaccionesRepository,
    private readonly pagosTransaccionDeudaRepository: PagosTransaccionDeudaRepository,
    private readonly isipassGraphqlService: IsipassGraphqlService,
    private readonly pagosComprobanteFacturaRepository: PagosComprobanteFacturaRepository,
    @Inject('DB_CONNECTION') private db: IDatabase<any>,
  ) {}

  async buscarDatosCliente(tipoPago: string, parametroBusqueda: string): Promise<DatosClienteResponseDto> {
    try {
      const deudas = await this.pagosDeudasRepository.findByCriterio(parametroBusqueda, parseInt(tipoPago));
      return {
        codigoCliente: deudas[0].codigo_cliente,
        nombreCompleto: deudas[0].nombre_completo,
        tipoDocumento: deudas[0].tipo_documento,
        numeroDocumento: deudas[0].numero_documento,
        complementoDocumento: deudas[0].complemento_documento ?? '',
        email: deudas[0].email ?? '',
        telefono: deudas[0].telefono ?? '',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('No se encontraron registros de cliente.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async buscarDeudaCliente(tipoPago: string, parametroBusqueda: string): Promise<DatosClienteResponseDto[]> {
    console.log(tipoPago);
    try {
      const deudas = await this.pagosDeudasRepository.findByCriterio(parametroBusqueda, parseInt(tipoPago));
      return deudas.map((obj) => ({
        deudaId: obj.deuda_id,
        codigoProducto: obj.codigo_producto,
        descripcion: obj.descripcion,
        periodo: obj.periodo,
        cantidad: obj.cantidad,
        precioUnitario: obj.precio_unitario,
        montoDescuento: obj.monto_descuento ?? 0,
        montoTotal: parseFloat(obj.precio_unitario) * parseFloat(obj.cantidad ?? 1) - parseFloat(obj.monto_descuento ?? 0),
        email: obj.email,
        telefono: obj.telefono,
        fechaRegistro: obj.fecha_registro,
      }));
    } catch (error) {
      console.log(error);
      throw new HttpException('No se encontraron registros de deuda.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async confirmaPagoCaja(deudasIds: number[]) {
    const ipServidor = os.hostname();
    const fechaInicio = new Date();
    let correoCliente = 'sinemailcotel@quickpay.com.bo';
    let transactionInsert: any;
    try {
      const lstTransacciones = await this.pagosTransaccionesRepository.findByDeudasIds(deudasIds);
      if (lstTransacciones.length > 0) {
        throw new Error('las deudas ya se encuentran pagadas');
      }

      const lstDeudas = await this.pagosDeudasRepository.findByDeudasIds(deudasIds);
      if (lstDeudas.length == 0) {
        throw new Error('las deudas no existen');
      }

      // Calcular el total a pagar sumando (precio_unitario * cantidad - monto_descuento) de cada deuda
      const totalAPagar = parseFloat(
        lstDeudas
          .reduce((acc, deuda) => {
            const monto = parseFloat(deuda.precio_unitario ?? '0');
            const cantidad = parseFloat(deuda.cantidad ?? '1');
            const montoDescuento = parseFloat(deuda.monto_descuento ?? '0');
            return acc + (monto * cantidad - montoDescuento);
          }, 0)
          .toFixed(2),
      );

      await this.db.tx(async (t) => {
        transactionInsert = await this.pagosTransaccionesRepository.create(
          {
            metodo_pago_id: 1018, //CAJA
            monto_pagado: totalAPagar,
            medio_pago_id: 1020, //EFECTIVO
            moneda: 'BOB',
            estado_transaccion_id: 1009, // PAGADO
            estado_id: 1000,
          },
          t,
        );
        // cambair estado de deudas reservados a PAGADO
        for (const deudaReservado of lstDeudas) {
          await this.pagosTransaccionDeudaRepository.create(
            {
              transaccion_id: transactionInsert.transaccion_id,
              deuda_id: deudaReservado.deuda_id,
              monto_pagado: totalAPagar,
              estado_id: 1000,
            },
            t,
          );
        }
      });
    } catch (error) {
      console.error('Error en la transacción:', error);
      throw new HttpException(error.message || 'Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const vNumeroUnico = FuncionesFechas.generarNumeroUnico();
    let lstFacturas = await this.generarFacturaISIPASS(deudasIds, transactionInsert.transaccion_id, vNumeroUnico + '');
    return lstFacturas;
  }

  private async generarFacturaISIPASS(deudasIds: number[], vTransactionId: number, vNumeroUnico: string): Promise<any> {
    const ipServidor = os.hostname();
    const fechaInicio = new Date();
    try {
      const lstDeudas = await this.pagosDeudasRepository.findByDeudasIds(deudasIds);
      const resFacGenerado = await this.isipassGraphqlService.crearFactura(lstDeudas);
      const facturaCompraVentaCreate = resFacGenerado?.data?.facturaCompraVentaCreate || {};
      const { representacionGrafica, sucursal, puntoVenta } = facturaCompraVentaCreate;
      const pdfUrl = representacionGrafica?.pdf;
      const xmlUrl = representacionGrafica?.xml;

      if (!pdfUrl || !xmlUrl) {
        throw new Error('No se recibieron URLs de PDF o XML desde crearFactura');
      }

      let pdfBase64: string;
      let xmlBase64: string;
      let filePathPdf: string;
      let filePathXml: string;
      let lstDocumentos = [];

      try {
        const funcionesGenerales = new FuncionesGenerales();
        pdfBase64 = await funcionesGenerales.downloadFileAsBase64(pdfUrl);
        xmlBase64 = await funcionesGenerales.downloadFileAsBase64(xmlUrl);

        filePathPdf = path.join(this.storePath, 'facturas', `factura-${vTransactionId}_${vNumeroUnico}.pdf`);
        filePathXml = path.join(this.storePath, 'facturas', `factura-${vTransactionId}_${vNumeroUnico}.xml`);

        fs.writeFileSync(filePathPdf, Buffer.from(pdfBase64, 'base64'));
        fs.writeFileSync(filePathXml, Buffer.from(xmlBase64, 'base64'));
        console.log('Archivos (factura XML y PDF) descargados y almacenados exitosamente');

        lstDocumentos.push(`factura-${vTransactionId}_${vNumeroUnico}.pdf`);
      } catch (error) {
        throw new Error(`Error al descargar o guardar los archivos (XML y PDF): ${error.message}`);
      }

      await this.pagosComprobanteFacturaRepository.create({
        transaccion_id: vTransactionId,

        // Datos que retorna ISIPASS
        codigo_cliente: facturaCompraVentaCreate?.cliente?.codigoCliente,
        numero_documento: facturaCompraVentaCreate?.cliente?.numeroDocumento,
        razon_social: facturaCompraVentaCreate?.cliente?.razonSocial,
        complemento: facturaCompraVentaCreate?.cliente?.complemento,
        email: facturaCompraVentaCreate?.cliente?.email,

        cuf: facturaCompraVentaCreate?.cuf,
        numero_factura: facturaCompraVentaCreate?.numeroFactura,
        estado: facturaCompraVentaCreate?.state,

        url_pdf: representacionGrafica?.pdf,
        url_xml: representacionGrafica?.xml,
        url_sin: representacionGrafica?.sin,
        url_rollo: representacionGrafica?.rollo,

        sucursal_codigo: sucursal?.codigo,
        punto_venta_codigo: puntoVenta?.codigo,

        // otros campos
        ruta_xml: filePathXml,
        ruta_pdf: filePathPdf,

        estado_id: 1000,
      });

      return lstDocumentos;
    } catch (error) {
      this.pagosTransaccionesRepository.update(vTransactionId, {
        estado_transaccion_id: 1013, // PAGO FALLADO
      });

      console.error(`Error en  transaccion ${vTransactionId}:`, error);
      throw new HttpException(error.message || 'Error al generar la factura', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
