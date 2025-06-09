import { IsString, IsNumber, IsOptional, IsEmail } from 'class-validator';

export class DeudaExcelDto {
  @IsString()
  codigoCliente: string;

  @IsString()
  nombreCompleto: string;

  @IsString()
  tipoDocumento?: string;

  @IsString()
  numeroDocumento?: string;

  @IsOptional()
  @IsString()
  complementoDocumento?: string;

  @IsNumber()
  tipoPagoId: number;

  @IsString()
  codigoServicio: string;

  @IsString()
  descripcionServicio: string;

  @IsString()
  periodo?: string;

  @IsNumber()
  monto: number;

  @IsOptional()
  @IsNumber()
  montoDescuento?: number;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  telefono?: string;
}
