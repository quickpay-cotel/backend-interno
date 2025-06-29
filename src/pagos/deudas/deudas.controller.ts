import {  Controller, Post, UseGuards,Request, Delete, Param, ParseIntPipe, Put, Body } from '@nestjs/common';


import { DeudasService } from './deudas.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DeudaRequestDto } from './dto/request/deuda-request.dto';

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
  @UseGuards(JwtAuthGuard)
  @Put('modificar-deuda/:deudaId')
  async modificarDeuda(@Request() req,@Param('deudaId', ParseIntPipe) deudaId: number, @Body() dtoDeuda: DeudaRequestDto,) {
    const usuarioId = req.user.sub; 
    return this.deudasService.modificarDeuda(usuarioId,deudaId,dtoDeuda);
  }
}
