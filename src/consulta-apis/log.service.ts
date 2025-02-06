import { Injectable } from "@nestjs/common";
import { CotelApiLogRepository } from "src/common/repository/cotel.api.log.repository";

@Injectable()
export class LogService {
  constructor(
    private readonly cotelApiLogRepository: CotelApiLogRepository,
  ) {

  }
  async findAll() {
    return await this.cotelApiLogRepository.findConsultasExternas();
  }
}