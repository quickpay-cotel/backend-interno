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
  periodo?: string;
  
  @IsString()
  codigoProducto: string;

  @IsString()
  codigoProductoSin: string; // debe ser solo numeross asi es en SIAT
  

  @IsString()
  descripcion: string;

  @IsNumber()
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
}
