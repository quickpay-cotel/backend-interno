import {  Controller, Post, UseGuards,Request } from '@nestjs/common';


import { DeudasService } from './deudas.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('deudas')
export class DeudasController {
  constructor(private readonly deudasService: DeudasService) {}
  @UseGuards(JwtAuthGuard)
  @Post('deudas-cargados')
  async deudasCargados(@Request() req) {
    const usuarioId = req.user.sub; // <- Aquí se extrae del token JWT
    return this.deudasService.deudasTodos(usuarioId);
    
  }
}
