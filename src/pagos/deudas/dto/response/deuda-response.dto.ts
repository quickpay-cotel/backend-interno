// deuda.dto.ts
export class DeudaResponseDto {
  codigoCliente: string;
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  complementoDocumento: string;
  tipoPagoId: number;
  tipoPago: string;
  codigoServicio: string;
  descripcionServicio: string;
  periodo: string;
  monto: number;
  montoDescuento: number;
  email: string;
  telefono: string;
  fechaRegistro: string;
}
