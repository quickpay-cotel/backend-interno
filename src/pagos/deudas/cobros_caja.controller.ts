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
  async DatosCliente(@Body() body: ConsultaDeudaRequestDto) {
    const { tipoPago, parametroBusqueda } = body;
    return this.cobrosCajaService.buscarDatosCliente(tipoPago, parametroBusqueda);
  }
  @Post('cobros-pendiente')
  async DeudaCliente(@Body() body: ConsultaDeudaRequestDto) {
    const { tipoPago, parametroBusqueda } = body;
    return this.cobrosCajaService.cobrosPendientesByCriterioBusqueda(tipoPago, parametroBusqueda);
  }
  @Post('confirma-pago-caja')
  @UseGuards(JwtAuthGuard)
  async confirmaPagoCaja(@Body() deudasIds: number[],@Request() req) {
    return await this.cobrosCajaService.confirmaPagoCaja(req.user.sub,deudasIds);
  }
}
