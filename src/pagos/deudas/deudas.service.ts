import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PagosDeudasRepository } from 'src/common/repository/pagos/pagos.deudas.repository';
import { DeudaDto } from './dto/deuda.dto';
import { FuncionesFechas } from '../../common/utils/funciones.fechas';

@Injectable()
export class DeudasService {
  constructor(
    private readonly pagosDeudasRepository: PagosDeudasRepository
  ) { }

  async deudasTodos(usuarioId: number): Promise<DeudaDto[]> {
    try {
      const deudas = await this.pagosDeudasRepository.findAllDeudasByUsuarioId(usuarioId);
      
      return deudas.map(obj => ({
        codigoCliente: obj.codigo_cliente,
        nombreCompleto: obj.nombre_completo,
        tipoDocumento: obj.tipo_documento,
        numeroDocumento: obj.numero_documento,
        complementoDocumento: obj.complemento_documento,
        tipoPagoId: obj.tipo_pago_id,
        codigoServicio: obj.codigo_servicio,
        descripcionServicio: obj.descripcion_servicio,
        periodo: obj.periodo,
        monto: obj.monto,
        montoDescuento: obj.monto_descuento,
        email: obj.email,
        telefono: obj.telefono,
        fechaRegistro: FuncionesFechas.formatDateToDDMMYYYY( obj.fecha_registro),
      }));
    } catch (error) {
      throw new HttpException('No se pudieron obtener las deudas.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
