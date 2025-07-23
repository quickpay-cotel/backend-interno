import { IsString, IsNumber, IsEmail, IsOptional, IsBoolean, Min } from 'class-validator';
import { Transform } from 'class-transformer';

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
  periodo?: string;

  @IsString()
  codigoProducto: string;

  @IsString()
  codigoProductoSin: string;

  @IsString()
  descripcion: string;

  @IsNumber()
  @Min(1) // ✅ cantidad mínima permitida es 1
  cantidad: number;

  @IsNumber()
  precioUnitario: number;

  @IsOptional()
  @IsNumber()
  montoDescuento?: number;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @Transform(({ value }) => value === '1' || value === 1)
  @IsBoolean()
  generaFactura: boolean;
}

