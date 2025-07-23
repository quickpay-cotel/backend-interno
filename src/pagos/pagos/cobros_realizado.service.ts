import { DeudaRequestDto } from '../deudas/dto/request/deuda-request.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PagosDeudasRepository } from 'src/common/repository/pagos/pagos.deudas.repository';
import { DeudaResponseDto } from '../deudas/dto/response/deuda-response.dto';
import { FuncionesFechas } from '../../common/utils/funciones.fechas';
import { DatosClienteResponseDto } from '../deudas/dto/response/datos-cliente-response.dto';
import { RequestCobrosRealizadoDto } from './dto/request/request_cobros_realizado.dto';
import { PagosTransaccionesRepository } from 'src/common/repository/pagos/pagos.transacciones.repository';

@Injectable()
export class CobrosRealizadoService {
  constructor(private readonly pagosTransaccionesRepository: PagosTransaccionesRepository) {}
  async findCobrosRealizados(personaJuridicaId:number,cobrosRealizadoDto: RequestCobrosRealizadoDto) {
    return await this.pagosTransaccionesRepository.findCobrosRealizados( personaJuridicaId,cobrosRealizadoDto.fechaInicioPago, cobrosRealizadoDto.fechaFinPago
    );
  }
}
