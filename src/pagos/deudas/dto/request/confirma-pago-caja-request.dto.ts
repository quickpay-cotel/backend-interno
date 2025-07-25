// dto/confirma-pago-caja.dto.ts
import { IsArray, IsEmail, ArrayNotEmpty } from 'class-validator';

export class ConfirmaPagoCajaRequestDto {
  @IsArray()
  @ArrayNotEmpty()
  deudasIds: number[];

  @IsEmail()
  correo: string;
}
