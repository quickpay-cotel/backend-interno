import {  Controller, Post, UseGuards,Request, Delete, Param, ParseIntPipe } from '@nestjs/common';


import { DeudasService } from './deudas.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('deudas')
export class DeudasController {
  constructor(private readonly deudasService: DeudasService) {}
  @UseGuards(JwtAuthGuard)
  @Post('deudas-por-usuario')
  async deudasCargados(@Request() req) {
    const usuarioId = req.user.sub; 
    return this.deudasService.deudasTodos(usuarioId);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('anular-deuda/:deudaId')
  async anularDeuda(@Request() req,@Param('deudaId', ParseIntPipe) deudaId: number) {
    const usuarioId = req.user.sub;
    return this.deudasService.anularDeuda(usuarioId, deudaId);
  }
}
