import { Controller, Post, UseGuards, Body, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestCobrosRealizadoDto } from './dto/request/request_cobros_realizado.dto';
import { CobrosRealizadoService } from './cobros_realizado.service';

@Controller('cobros-realizado')
export class CobrosRealizadoController {
  constructor(private readonly cobrosRealizadoService: CobrosRealizadoService) {}
  @Post('cobros-realizado')
  @UseGuards(JwtAuthGuard) // Protege el endpoint con el guardia JWT
  async pagosRealizados(@Request() req,@Body() cobrosRealizadoDto: RequestCobrosRealizadoDto) {
    const personaJuridicaId = req.user.datosPersona.persona_juridica_id;
    return await this.cobrosRealizadoService.findCobrosRealizados(personaJuridicaId,cobrosRealizadoDto);
  }

  
}
