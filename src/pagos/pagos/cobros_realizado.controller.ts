import { Controller, Post, UseGuards, Body, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CobrosRealizadoDto } from './dto/request/cobros_realizado.dto';
import { CobrosRealizadoService } from './cobros_realizado.service';

@Controller('cobros-realizado')
export class CobrosRealizadoController {
  constructor(private readonly cobrosRealizadoService: CobrosRealizadoService) {}
  @Post('cobros-realizado')
  @UseGuards(JwtAuthGuard) // Protege el endpoint con el guardia JWT
  async pagosRealizados(@Request() req,@Body() cobrosRealizadoDto: CobrosRealizadoDto) {
    const usuarioId = req.user.sub;
    return await this.cobrosRealizadoService.findCobrosRealizados(cobrosRealizadoDto);
  }

}
