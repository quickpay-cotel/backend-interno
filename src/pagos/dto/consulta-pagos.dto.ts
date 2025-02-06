import { Transform } from "class-transformer";
import { IsIn, IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";

export class ConsultaPagosDto {
  @IsString()
  nombreCompleto: string;
  @IsString()
  servicio: string;
  @IsString()
  idTransaccion: string;
  @IsString()
  periodo: string;
  @IsString()
  codigoDeuda: string;
  @IsString()
  mensajeDeuda: string;
  @IsString()
  mensajeContrato: string;
  @IsString()
  tipoDocumento: string;
  @IsString()
  numeroDocumento: string;
  @IsString()
  fechaInicioPago: Date;
  @IsString()
  fechaFinPago: Date;
}
