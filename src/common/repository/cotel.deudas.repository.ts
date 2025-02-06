import { Injectable, Inject } from "@nestjs/common";
import { IDatabase } from "pg-promise"; // Usamos pg-promise
@Injectable()
export class CotelDeudasRepository {
  private db: IDatabase<any>;
  constructor(@Inject("DB_CONNECTION") db: IDatabase<any>) {
    this.db = db; // Inyectamos la conexión de pg-promise
  }


  async findPagosRealizados(pNombreCompleto:string, servicio:string, 
    idTransaccion:string, periodo:string, codigoDeuda:string, mensajeDeuda:string, mensajeContrato:string,
    tipoDocumento:string, numeroDocumento:string,fechaInicioPago:Date, fechaFinPago:Date
  ) {
    console.log(pNombreCompleto,servicio,idTransaccion,periodo,codigoDeuda,mensajeDeuda,mensajeContrato,tipoDocumento,numeroDocumento,fechaInicioPago,fechaFinPago);
    const params = [pNombreCompleto,servicio,idTransaccion,periodo,codigoDeuda,mensajeDeuda,mensajeContrato,tipoDocumento,numeroDocumento,fechaInicioPago,fechaFinPago];
    const query = `select * from  cotel.fn_deudas_cobrados($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11);`;
    return await this.db.manyOrNone(query,params);
  }
}