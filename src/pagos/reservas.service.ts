import { Injectable } from "@nestjs/common";
import { CotelApiLogRepository } from "src/common/repository/cotel.api.log.repository";
import { CotelDeudasRepository } from "src/common/repository/cotel.deudas.repository";
import { ConsultaPagosDto } from "./dto/consulta-pagos.dto";

@Injectable()
export class ReservasService {
  constructor(
    private readonly cotelApiLogRepository: CotelApiLogRepository,
    private readonly cotelDeudasRepository: CotelDeudasRepository
  ) {

  }
  async findConsultasExternas() {
    return await this.cotelApiLogRepository.findConsultasExternas();
  }
  async findPagosRealizados(consultaPagosDto: ConsultaPagosDto) {
    return await this.cotelDeudasRepository.findPagosRealizados(
      consultaPagosDto.nombreCompleto, consultaPagosDto.servicio, consultaPagosDto.idTransaccion,
      consultaPagosDto.periodo,consultaPagosDto.codigoDeuda, consultaPagosDto.mensajeDeuda,
       consultaPagosDto.mensajeContrato,consultaPagosDto.tipoDocumento, 
       consultaPagosDto.numeroDocumento, consultaPagosDto.fechaInicioPago, consultaPagosDto.fechaFinPago
    );
  }
}