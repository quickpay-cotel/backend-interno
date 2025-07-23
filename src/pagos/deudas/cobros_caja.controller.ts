import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request
} from '@nestjs/common';

import { ConsultaDeudaRequestDto } from './dto/request/consulta-deuda-request.dto';
import { CobrosCajaService } from './cobros_caja.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('cobros-caja')
export class CobrosCajaController {
  constructor(private readonly cobrosCajaService: CobrosCajaService) {}

  @Post('datos-cliente')
  @UseGuards(JwtAuthGuard)
  async DatosCliente(@Body() body: ConsultaDeudaRequestDto,@Request() req) {
    const { tipoPago, parametroBusqueda } = body;
    const personaJuridicaId = req.user.datosPersona.persona_juridica_id;
    return this.cobrosCajaService.buscarDatosCliente(tipoPago, parametroBusqueda,personaJuridicaId);
  }
  @Post('cobros-pendiente')
  @UseGuards(JwtAuthGuard)
  async DeudaCliente(@Body() body: ConsultaDeudaRequestDto,@Request() req) {
    const { tipoPago, parametroBusqueda } = body;
    const personaJuridicaId = req.user.datosPersona.persona_juridica_id;
    return this.cobrosCajaService.cobrosPendientesByCriterioBusqueda(tipoPago, parametroBusqueda,personaJuridicaId);
  }
  @Post('confirma-pago-caja')
  @UseGuards(JwtAuthGuard)
  async confirmaPagoCaja(@Body() deudasIds: number[],@Request() req) {
    const personaJuridicaId = req.user.datosPersona.persona_juridica_id;
    return await this.cobrosCajaService.confirmaPagoCaja(req.user.sub,deudasIds,personaJuridicaId);
  }
}
