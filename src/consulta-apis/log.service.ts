import { ConsultaApiLogDto } from './dto/consulta-apilogs.dto';
import { Injectable } from "@nestjs/common";
import { CotelApiLogRepository } from "src/common/repository/cotel.api.log.repository";

@Injectable()
export class LogService {
  constructor(
    private readonly cotelApiLogRepository: CotelApiLogRepository,
  ) {

  }
  async findApiLogRealizados(consultaApiLogDto:ConsultaApiLogDto) {
    return await this.cotelApiLogRepository.findApiLogRealizados(consultaApiLogDto.empresa,consultaApiLogDto.api, consultaApiLogDto.status,
      consultaApiLogDto.fechaInicio,consultaApiLogDto.fechaFin);
  }
}