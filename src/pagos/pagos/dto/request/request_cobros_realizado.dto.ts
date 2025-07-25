import { CobrosRealizadoController } from '../../cobros_realizado.controller';
import { IsNotEmpty, IsString } from "class-validator";

export class RequestCobrosRealizadoDto {
  @IsString()
  @IsNotEmpty()
  fechaInicioPago: Date;
  @IsString()
  @IsNotEmpty()
  fechaFinPago: Date;
}
