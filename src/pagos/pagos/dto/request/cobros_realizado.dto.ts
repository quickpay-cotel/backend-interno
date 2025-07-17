import { CobrosRealizadoController } from './../../cobros_realizado.controller';
import { IsNotEmpty, IsString } from "class-validator";

export class CobrosRealizadoDto {
  @IsString()
  @IsNotEmpty()
  fechaInicioPago: Date;
  @IsString()
  @IsNotEmpty()
  fechaFinPago: Date;
}
