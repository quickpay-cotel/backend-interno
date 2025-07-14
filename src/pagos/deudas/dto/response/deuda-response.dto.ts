// deuda.dto.ts
export class DeudaResponseDto {
  codigoCliente: string;
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  complementoDocumento: string;
  tipoPagoId: number;
  tipoPago: string;
  periodo: string;
  codigoProducto: string;
  codigoProductoSin: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  montoDescuento: number;
  montoTotal: number;
  email: string;
  telefono: string;
  fechaRegistro: string;
}
