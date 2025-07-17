import { DeudaRequestDto } from '../deudas/dto/request/deuda-request.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PagosDeudasRepository } from 'src/common/repository/pagos/pagos.deudas.repository';
import { DeudaResponseDto } from '../deudas/dto/response/deuda-response.dto';
import { FuncionesFechas } from '../../common/utils/funciones.fechas';
import { DatosClienteResponseDto } from '../deudas/dto/response/datos-cliente-response.dto';
import { CobrosRealizadoDto } from './dto/request/cobros_realizado.dto';
import { PagosTransaccionesRepository } from 'src/common/repository/pagos/pagos.transacciones.repository';

@Injectable()
export class CobrosRealizadoService {
  constructor(private readonly pagosTransaccionesRepository: PagosTransaccionesRepository) {}
  async findCobrosRealizados(usuarioId:number,cobrosRealizadoDto: CobrosRealizadoDto) {
    return await this.pagosTransaccionesRepository.findCobrosRealizados( usuarioId,cobrosRealizadoDto.fechaInicioPago, cobrosRealizadoDto.fechaFinPago
    );
  }
}
