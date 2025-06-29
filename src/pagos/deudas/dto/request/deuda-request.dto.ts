// deuda.dto.ts
export class DeudaRequestDto {
  codigoCliente: string;
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  complementoDocumento: string;
  tipoPagoId: number;
  codigoServicio: string;
  descripcionServicio: string;
  periodo: string;
  monto: number;
  montoDescuento: number;
  email: string;
  telefono: string;
  fechaRegistro: string;
}
