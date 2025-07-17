import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';



import { ConsultaDeudaRequestDto } from './dto/request/consulta-deuda-request.dto';
import { CobrosCajaService } from './cobros_caja.service';

@Controller('cobros-caja')
export class CobrosCajaController {
  constructor(private readonly cobrosCajaService: CobrosCajaService) {}

   @Post('datos-pendiente-cliente')
  async DatosCliente(@Body() body: ConsultaDeudaRequestDto) {
    const { tipoPago, parametroBusqueda } = body;
    return this.cobrosCajaService.buscarDatosCliente(tipoPago, parametroBusqueda);
  }
  @Post('cobros-pendiente-cliente')
  async DeudaCliente(@Body() body: ConsultaDeudaRequestDto) {
    const { tipoPago, parametroBusqueda } = body;
    return this.cobrosCajaService.buscarDeudaCliente(tipoPago, parametroBusqueda);
  }
  @Post('confirma-pago-caja')
  async confirmaPagoCaja(@Body() deudasIds: number[]) {
    return await this.cobrosCajaService.confirmaPagoCaja(deudasIds);
  }
}
