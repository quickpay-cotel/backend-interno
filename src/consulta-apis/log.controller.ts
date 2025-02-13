import { Controller, Get, Post, UseGuards,Request, Body } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import {  LogService } from "./log.service";
import { ConsultaApiLogDto } from "./dto/consulta-apilogs.dto";

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) { }

  @Post('consultas-externas')
  @UseGuards(JwtAuthGuard) // Protege el endpoint con el guardia JWT
  async getOptions(@Body() consultaApiLogDto: ConsultaApiLogDto) {
    return await this.logService.findApiLogRealizados(consultaApiLogDto);
  }
}