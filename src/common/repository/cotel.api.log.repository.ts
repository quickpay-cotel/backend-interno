import { Injectable, Inject } from "@nestjs/common";
import { IDatabase } from "pg-promise"; // Usamos pg-promise
@Injectable()
export class CotelApiLogRepository {
  private db: IDatabase<any>;

  constructor(@Inject("DB_CONNECTION") db: IDatabase<any>) {
    this.db = db; // Inyectamos la conexión de pg-promise
  }

  async findConsultasExternas() {
    const query = `select al."method",al.url,al.request_data, al.response_status, al.response_data ,
to_char(al.fecha_registro, 'DD/MM/YYYY HH24:MI:SS') AS fecha_registro   
from cotel.api_logs al  order by 1 desc;`;
    return await this.db.manyOrNone(query);
  }
}