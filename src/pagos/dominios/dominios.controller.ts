import { Controller, Get, UseGuards, Request, Param } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DominioService } from './dominios.service';

@Controller('dominios')
export class DominiosController {
  constructor(private readonly dominioService: DominioService) {}

  @UseGuards(JwtAuthGuard)
  @Get('by-dominio/:dominio')
  async obtenerPagoSemana(@Request() req, @Param('dominio') dominio: string) {
    return await this.dominioService.findByDominio(dominio);
  }
}
