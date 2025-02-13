import { Injectable, Inject } from "@nestjs/common";
import { IDatabase } from "pg-promise"; // Usamos pg-promise
@Injectable()
export class CotelApiLogRepository {
  private db: IDatabase<any>;

  constructor(@Inject("DB_CONNECTION") db: IDatabase<any>) {
    this.db = db; // Inyectamos la conexión de pg-promise
  }

  async findApiLogRealizados(empresa: string, api: string,
    status: string, fechaInicioPago: Date, fechaFinPago: Date
  ) {
    // Función auxiliar para convertir valores vacíos a null
    const toNull = (value: any) => {
      // Usamos trim() antes de hacer la comparación
      const trimmedValue = typeof value === 'string' ? value.trim() : value;
      return (trimmedValue === "" || trimmedValue === undefined ? null : trimmedValue);
    };

    //console.log(pNombreCompleto,servicio,idTransaccion,periodo,codigoDeuda,mensajeDeuda,mensajeContrato,tipoDocumento,numeroDocumento,fechaInicioPago,fechaFinPago);
    const params = [
      toNull(empresa), toNull(api), toNull(status),  toNull(fechaInicioPago), toNull(fechaFinPago)
    ];
    const query = `select * from  cotel.fn_log_api_externo($1,$2,$3,$4,$5);`;
    return await this.db.manyOrNone(query, params);
  }
}