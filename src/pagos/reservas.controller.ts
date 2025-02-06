import { Controller, Get, Post, UseGuards,Request, Body } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import {  ReservasService } from "./reservas.service";
import { ConsultaPagosDto } from "./dto/consulta-pagos.dto";

@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) { }

  @Get('consultas-externas')
  @UseGuards(JwtAuthGuard) // Protege el endpoint con el guardia JWT
  async getOptions(@Request() req) {
    return await this.reservasService.findConsultasExternas();
  }


  @Post("pagos-realizados")
  @UseGuards(JwtAuthGuard) // Protege el endpoint con el guardia JWT
  async pagosRealizados(@Body() consultaPagosDto: ConsultaPagosDto) {
      return await this.reservasService.findPagosRealizados(consultaPagosDto);
  }

}