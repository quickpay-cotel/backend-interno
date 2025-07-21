import { DeudaRequestDto } from './dto/request/deuda-request.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PagosDeudasRepository } from 'src/common/repository/pagos/pagos.deudas.repository';
import { DeudaResponseDto } from './dto/response/deuda-response.dto';
import { FuncionesFechas } from '../../common/utils/funciones.fechas';
import { DatosClienteResponseDto } from './dto/response/datos-cliente-response.dto';

@Injectable()
export class CobrosPendientesService {
  constructor(private readonly pagosDeudasRepository: PagosDeudasRepository) {}

  async cobrosPendienteEmpresaByUsuarioId(usuarioId: number): Promise<DeudaResponseDto[]> {
    try {
      const deudas = await this.pagosDeudasRepository.findAllDeudasEmpresaByUsuarioId(usuarioId);

      return deudas.map((obj) => ({
        deudaId: obj.deuda_id,
        codigoCliente: obj.codigo_cliente,
        nombreCompleto: obj.nombre_completo,
        tipoDocumento: obj.tipo_documento,
        numeroDocumento: obj.numero_documento,
        complementoDocumento: obj.complemento_documento,
        tipoPagoId: obj.tipo_pago_id,
        tipoPago: obj.tipo_pago,
        periodo: obj.periodo,
        codigoProducto: obj.codigo_producto,
        codigoProductoSin: obj.codigo_producto_sin,
        descripcion: obj.descripcion,
        cantidad: obj.cantidad,
        precioUnitario: obj.precio_unitario,
        montoDescuento: obj.monto_descuento ?? 0,
        montoTotal: (parseFloat(obj.precio_unitario) * parseFloat(obj.cantidad ?? 1)) - parseFloat(obj.monto_descuento ?? 0),
        email: obj.email,
        telefono: obj.telefono,
        fechaRegistro: FuncionesFechas.formatDateToDDMMYYYY(obj.fecha_registro),
      }));
    } catch (error) {
      throw new HttpException('No se pudieron obtener las deudas.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async anularDeuda(usuarioId: number, deudaId: number) {
    try {
      await this.pagosDeudasRepository.update(deudaId, { estado_id: 1001 });
    } catch (error) {
      throw new HttpException('No se pudieron anulas las deudas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async modificarDeuda(usuarioId: number, deudaId: number, deudaRequestDto: DeudaRequestDto) {
    try {
      await this.pagosDeudasRepository.update(deudaId, {
        codigo_cliente: deudaRequestDto.codigoCliente,
        nombre_completo: deudaRequestDto.nombreCompleto,
        tipo_documento: deudaRequestDto.tipoDocumento,
        numero_documento: deudaRequestDto.numeroDocumento,
        complemento_documento: deudaRequestDto.complementoDocumento,
        tipo_pago_id: deudaRequestDto.tipoPagoId,
        codigo_servicio: deudaRequestDto.codigoServicio,
        descripcion_servicio: deudaRequestDto.descripcionServicio,
        periodo: deudaRequestDto.periodo,
        monto: deudaRequestDto.monto,
        monto_descuento: deudaRequestDto.montoDescuento,
        email: deudaRequestDto.email,
        telefono: deudaRequestDto.telefono,
      });
    } catch (error) {
      console.error('Error al modificar la deuda:', error);
      throw new HttpException('No se pudieron modificar las deudas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
