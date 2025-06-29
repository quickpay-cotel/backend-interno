import { DeudaRequestDto } from './dto/request/deuda-request.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PagosDeudasRepository } from 'src/common/repository/pagos/pagos.deudas.repository';
import { DeudaResponseDto } from './dto/response/deuda-response.dto';
import { FuncionesFechas } from '../../common/utils/funciones.fechas';

@Injectable()
export class DeudasService {
  constructor(private readonly pagosDeudasRepository: PagosDeudasRepository) {}

  async deudasTodos(usuarioId: number): Promise<DeudaResponseDto[]> {
    try {
      const deudas =
        await this.pagosDeudasRepository.findAllDeudasByUsuarioId(usuarioId);

      return deudas.map((obj) => ({
        deudaId: obj.deuda_id,
        codigoCliente: obj.codigo_cliente,
        nombreCompleto: obj.nombre_completo,
        tipoDocumento: obj.tipo_documento,
        numeroDocumento: obj.numero_documento,
        complementoDocumento: obj.complemento_documento,
        tipoPagoId: obj.tipo_pago_id,
        tipoPago: obj.tipo_pago,
        codigoServicio: obj.codigo_servicio,
        descripcionServicio: obj.descripcion_servicio,
        periodo: obj.periodo,
        monto: obj.monto,
        montoDescuento: obj.monto_descuento,
        email: obj.email,
        telefono: obj.telefono,
        fechaRegistro: FuncionesFechas.formatDateToDDMMYYYY(obj.fecha_registro),
      }));
    } catch (error) {
      throw new HttpException(
        'No se pudieron obtener las deudas.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async anularDeuda(usuarioId: number, deudaId: number) {
    try {
      await this.pagosDeudasRepository.update(deudaId, { estado_id: 1001 });
    } catch (error) {
      throw new HttpException(
        'No se pudieron anulas las deudas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async modificarDeuda(usuarioId: number, deudaId: number,deudaRequestDto:DeudaRequestDto) {
    try {
      await this.pagosDeudasRepository.update(deudaId, 
        { 
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
           telefono: deudaRequestDto.telefono
        }
      );
    }
    catch (error) {
      console.error('Error al modificar la deuda:', error);
      throw new HttpException(
        'No se pudieron modificar las deudas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } 
  }
}
