import {
  Controller,
  Post,
  UseGuards,
  Request,
  Delete,
  Param,
  ParseIntPipe,
  Put,
  Body,
} from '@nestjs/common';


import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DeudaRequestDto } from './dto/request/deuda-request.dto';
import { CobrosPendientesService } from './cobros_pendientes.service';

@Controller('cobros-pendientes')
export class CobrosPendientesController {
  constructor(private readonly cobrosPendientesService: CobrosPendientesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('cobros-pendiente-by-persona_juridica')
  async deudasCargados(@Request() req) {
    const persona_juridica_id = req.user.datosPersona.persona_juridica_id;
    return this.cobrosPendientesService.cobrosPendienteEmpresaByPersonaJuridicaId(persona_juridica_id);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('anular-deuda/:deudaId')
  async anularDeuda(
    @Request() req,
    @Param('deudaId', ParseIntPipe) deudaId: number,
  ) {
    const usuarioId = req.user.sub;
    return this.cobrosPendientesService.anularDeuda(usuarioId, deudaId);
  }
  @UseGuards(JwtAuthGuard)
  @Put('modificar-deuda/:deudaId')
  async modificarDeuda(
    @Request() req,
    @Param('deudaId', ParseIntPipe) deudaId: number,
    @Body() dtoDeuda: DeudaRequestDto,
  ) {
    const usuarioId = req.user.sub;
    return this.cobrosPendientesService.modificarDeuda(usuarioId, deudaId, dtoDeuda);
  }

}
