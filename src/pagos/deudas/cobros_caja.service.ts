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
import { UsuarioUsuariosRepository } from 'src/common/repository/usuario/usuario.usuarios.repository';
import { PagosDominiosRepository } from 'src/common/repository/pagos/pagos.dominios.repository';
import axios from 'axios';
import { PagosComprobanteReciboRepository } from 'src/common/repository/pagos/pagos.comprobante_recibo.repository';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from 'src/common/correos/email.service';
import { UsuarioPersonaJuridicaRepository } from 'src/common/repository/usuario/usuario.persona_juridica.repository';

@Injectable()
export class CobrosCajaService {
  //private storePath = path.posix.join(process.cwd(), 'store');
  private storePath = process.env.STATIC_FILES_PATH;

  constructor(
    private readonly pagosDeudasRepository: PagosDeudasRepository,
    private readonly pagosTransaccionesRepository: PagosTransaccionesRepository,
    private readonly pagosTransaccionDeudaRepository: PagosTransaccionDeudaRepository,
    private readonly isipassGraphqlService: IsipassGraphqlService,
    private readonly pagosComprobanteFacturaRepository: PagosComprobanteFacturaRepository,
    private readonly usuarioUsuariosRepository: UsuarioUsuariosRepository,
    private readonly pagosDominiosRepository: PagosDominiosRepository,
    private readonly pagosComprobanteReciboRepository: PagosComprobanteReciboRepository,
    private readonly emailService: EmailService,
    private readonly usuarioPersonaJuridicaRepository:UsuarioPersonaJuridicaRepository,
    @Inject('DB_CONNECTION') private db: IDatabase<any>,
  ) {}

  async buscarDatosCliente(tipoPago: string, parametroBusqueda: string, personaJuridicaId: number): Promise<DatosClienteResponseDto> {
    try {
      const deudas = await this.pagosDeudasRepository.datosClienteByCriterioBusqueda(parametroBusqueda, parseInt(tipoPago), personaJuridicaId);
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
  async cobrosPendientesByCriterioBusqueda(tipoPago: string, parametroBusqueda: string, personaJuridicaId: number): Promise<DatosClienteResponseDto[]> {
    console.log(tipoPago);
    try {
      const deudas = await this.pagosDeudasRepository.cobrosPendientesByCriterioBusqueda(parametroBusqueda, parseInt(tipoPago), personaJuridicaId);
      return deudas.map((obj) => ({
        deudaId: obj.deuda_id,
        codigoProducto: obj.codigo_producto,
        descripcion: obj.descripcion,
        periodo: obj.periodo,
        cantidad: obj.cantidad,
        precioUnitario: obj.precio_unitario,
        montoDescuento: obj.monto_descuento ?? 0,
        montoTotal: obj.monto_total ?? 0,
        email: obj.email,
        telefono: obj.telefono,
        generaFactura: obj.genera_factura ? 'SI' : 'NO',
        fechaRegistro: obj.fecha_registro,
      }));
    } catch (error) {
      console.log(error);
      throw new HttpException('No se encontraron registros de deuda.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async confirmaPagoCaja(usuarioId: number, deudasIds: number[],personaJuridicaId:number) {
    let transactionInsert: any;
    const myUuid = uuidv4();
    let lstDeudas = [];
    let totalAPagar = 0;
    try {
      const lstTransacciones = await this.pagosTransaccionesRepository.findByDeudasIds(deudasIds);
      if (lstTransacciones.length > 0) {
        throw new Error('las deudas ya se encuentran pagadas');
      }

      lstDeudas = await this.pagosDeudasRepository.findByDeudasIds(deudasIds);
      if (lstDeudas.length == 0) {
        throw new Error('las deudas no existen');
      }
      
      // Calcular el total a pagar sumando (precio_unitario * cantidad - monto_descuento) de cada deuda
      totalAPagar = parseFloat(
        lstDeudas
          .reduce((acc, deuda) => {
            const monto = parseFloat(deuda.precio_unitario ?? '0');
            const cantidad = parseFloat(deuda.cantidad);
            const montoDescuento = parseFloat(deuda.monto_descuento ?? '0');
            return acc + (monto * cantidad - montoDescuento);
          }, 0)
          .toFixed(2),
      );
 

      await this.db.tx(async (t) => {
        // registrar transaccion
        transactionInsert = await this.pagosTransaccionesRepository.create(
          {
            codigo_pago: myUuid,
            origen_pago_id: 1020, // CAJA
            metodo_pago_id: 1018, //CAJA
            monto_pagado: totalAPagar,
            moneda: 'BOB',
            estado_transaccion_id: 1009, // PAGADO
            estado_id: 1000,
          },
          t,
        );

        // registarr transaccion deudaaaa
        for (const deudaReservado of lstDeudas) {
          await this.pagosTransaccionDeudaRepository.create(
            {
              transaccion_id: transactionInsert.transaccion_id,
              deuda_id: deudaReservado.deuda_id,
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

    let lstDocuentoFacturas = await this.generarFacturaISIPASS(deudasIds, transactionInsert.transaccion_id, myUuid);
    let lstDocuentoRecibo = await this.generarRecibo(usuarioId, deudasIds, transactionInsert.transaccion_id, myUuid);

    const lstTransacciones = await this.pagosTransaccionesRepository.findByDeudasIds(deudasIds);


    const personaJuridica:any = await this.usuarioPersonaJuridicaRepository.findByFilters({persona_juridica_id:personaJuridicaId,estado_id : 1000}); // siempre debe retornan 1 ya  q esta busncaod por el id
    let paymentDataConfirmado = {
      numeroTransaccion: myUuid,
      monto: totalAPagar,
      moneda: 'Bs',
      fecha: lstTransacciones[0].fecha_transaccion,
      logoUrl: '',
      nombreEmpresa: personaJuridica[0].nombre_empresa,
    };

    let correoEnviado = await this.emailService.sendMailNotifyPaymentAndAttachmentsMailtrap(lstDeudas[0].email, 'Confirmación de Pago Recibida - Pruebas', 
      paymentDataConfirmado, `${this.storePath}/recibos/recibo-${ myUuid }.pdf`, `${this.storePath}/facturas/factura-${myUuid}.pdf`, `${this.storePath}/facturas/factura-${myUuid}.xml`);
    this.pagosTransaccionesRepository.update(transactionInsert.transaccion_id, { correo_enviado: correoEnviado });

    return [...(lstDocuentoFacturas ?? []), ...(lstDocuentoRecibo ?? [])];
  }

  private async generarFacturaISIPASS(deudasIds: number[], vTransactionId: number, myUuid: string): Promise<any> {
    try {
      let lstDeudas = await this.pagosDeudasRepository.findByDeudasIds(deudasIds);
      if (lstDeudas.length == 0) {
        throw new Error('las deudas no existen');
      }
      lstDeudas = lstDeudas.filter((r) => r.genera_factura === true); // solo las que genera Factura

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

      let fileNamePdf = `factura-${myUuid}.pdf`;
      let fileNameXml = `factura-${myUuid}.xml`;

      try {
        const funcionesGenerales = new FuncionesGenerales();
        pdfBase64 = await funcionesGenerales.downloadFileAsBase64(pdfUrl);
        xmlBase64 = await funcionesGenerales.downloadFileAsBase64(xmlUrl);

        filePathPdf = path.join(this.storePath, 'facturas', fileNamePdf);
        filePathXml = path.join(this.storePath, 'facturas', fileNameXml);

        fs.writeFileSync(filePathPdf, Buffer.from(pdfBase64, 'base64'));
        fs.writeFileSync(filePathXml, Buffer.from(xmlBase64, 'base64'));
        console.log('Archivos (factura XML y PDF) descargados y almacenados exitosamente');

        lstDocumentos.push(fileNamePdf);
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
        ruta_xml: fileNameXml,
        ruta_pdf: fileNamePdf,
        estado_factura_id: 1021, // VIGENTE
        estado_id: 1000,
      });

      return lstDocumentos;
    } catch (error) {
      //  registrar log de error .....
      this.pagosTransaccionesRepository.update(vTransactionId, {
        estado_transaccion_id: 1013, // PAGO FALLADO
      });
      console.error(`Error al generar factura en la transaccion  ${vTransactionId}:`, error);
      //throw new HttpException(error.message || 'Error al generar la factura', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async generarRecibo(usuarioId: number, deudasIds: number[], vTransactionId: number, myUuid: string): Promise<any> {
    let lstDocumentos = [];
    try {
      // se reuqiere fecha de pago para generar el recibo
      const lstTransacciones = await this.pagosTransaccionesRepository.findByDeudasIds(deudasIds);
      if (lstTransacciones.length == 0) {
        throw new Error('las deudas no estan pagadas');
      }

      const lstDeudas: any = await this.pagosDeudasRepository.findByDeudasIds(deudasIds);
      if (lstDeudas.length == 0) {
        throw new Error('las deudas no existen');
      }

      let nombreRecibo = `recibo-${ myUuid }.pdf`;

      const tipoPago = await this.pagosDominiosRepository.findById(lstDeudas[0].tipo_pago_id);

      let datosPersonaEmpresa = await this.usuarioUsuariosRepository.findDatosPersonaAndEmpresa(usuarioId);
      if (!datosPersonaEmpresa) {
        throw new Error('No existe datos empresa para el usuario ' + usuarioId);
      }

      const funcionesGenerales = new FuncionesGenerales();
      const base64Limpio = funcionesGenerales.limpiarBase64(datosPersonaEmpresa.logo_base64);

      let parametros = {
        P_logo_empresa_base64: base64Limpio,
        P_nombre_empresa: datosPersonaEmpresa.nombre_empresa,
        P_fecha_pago: lstTransacciones[0].fecha_transaccion,
        P_nombre_cliente: lstDeudas[0].nombre_completo,
        P_concepto: tipoPago.descripcion,
      };

      // Construir las filas de la tabla para todos los items de datosDeuda

      const detalleDeudas = lstDeudas.map((item) => {
        const cantidad = parseInt(item.cantidad ?? '0'); // entero, se queda como número
        const precioUnitario = parseFloat(item.precio_unitario ?? '0');
        const descuento = parseFloat(item.monto_descuento ?? '0');
        const montoTotal = cantidad * precioUnitario - descuento;

        return {
          descripcion: item.descripcion,
          periodo: item.periodo,
          cantidad: cantidad, // número entero, se queda number
          precio_unitario: precioUnitario.toFixed(2), // string "10.00"
          monto_descuento: descuento.toFixed(2), // string "0.00"
          monto_total: montoTotal.toFixed(2), // string "10.00"
        };
      });

      const payload = {
        data: detalleDeudas,
        parameters: parametros,
        templatePath: '/reports/recibo.jrxml',
        format: 'pdf',
      };

      const response = await axios.post(process.env.REPORT_API + '/reports/generate', payload, {
        responseType: 'arraybuffer', // 👈 Importante para recibir binario
        headers: { 'Content-Type': 'application/json' },
      });

      const pdfBuffer = Buffer.from(response.data);

      fs.writeFileSync(this.storePath + '/recibos/' + nombreRecibo, pdfBuffer);
      await this.pagosComprobanteReciboRepository.create({
        identificador: 0,
        transaccion_id: vTransactionId,
        ruta_pdf: nombreRecibo,
        fecha_emision: new Date(),
        estado_recibo_id: 1023, // VIGENTE
        estado_id: 1000,
      });

      lstDocumentos.push(nombreRecibo);
      return lstDocumentos;
    } catch (error) {
      //  registrar log de error .....
      this.pagosTransaccionesRepository.update(vTransactionId, {
        estado_transaccion_id: 1013, // PAGO FALLADO
      });
      console.error(`Error al generar recibo para transaccion  ${vTransactionId}:`, error);
      //throw new HttpException(error.message || 'Error al generar la factura', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
