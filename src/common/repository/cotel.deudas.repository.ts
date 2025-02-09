import { Injectable, Inject } from "@nestjs/common";
import { IDatabase } from "pg-promise"; // Usamos pg-promise
@Injectable()
export class CotelDeudasRepository {
  private db: IDatabase<any>;
  constructor(@Inject("DB_CONNECTION") db: IDatabase<any>) {
    this.db = db; // Inyectamos la conexión de pg-promise
  }


  async findPagosRealizados(pNombreCompleto: string, servicio: string,
    idTransaccion: string, periodo: string, codigoDeuda: string, mensajeDeuda: string, mensajeContrato: string,
    tipoDocumento: string, numeroDocumento: string, fechaInicioPago: Date, fechaFinPago: Date
  ) {
    // Función auxiliar para convertir valores vacíos a null
    const toNull = (value: any) => {
      // Usamos trim() antes de hacer la comparación
      const trimmedValue = typeof value === 'string' ? value.trim() : value;
      return (trimmedValue === "" || trimmedValue === undefined ? null : trimmedValue);
    };

    //console.log(pNombreCompleto,servicio,idTransaccion,periodo,codigoDeuda,mensajeDeuda,mensajeContrato,tipoDocumento,numeroDocumento,fechaInicioPago,fechaFinPago);
    const params = [
      toNull(pNombreCompleto), toNull(servicio), toNull(idTransaccion), toNull(periodo),
      toNull(codigoDeuda), toNull(mensajeDeuda), toNull(mensajeContrato),
      toNull(tipoDocumento), toNull(numeroDocumento), toNull(fechaInicioPago), toNull(fechaFinPago)
    ];
    const query = `select * from  cotel.fn_deudas_cobrados($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11);`;
    return await this.db.manyOrNone(query, params);
  }
}