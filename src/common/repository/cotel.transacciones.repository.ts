import { Injectable, Inject } from "@nestjs/common";
import { IDatabase } from "pg-promise"; // Usamos pg-promise
@Injectable()
export class CotelTransacionesRepository {
  private db: IDatabase<any>;

  constructor(@Inject("DB_CONNECTION") db: IDatabase<any>) {
    this.db = db; // Inyectamos la conexión de pg-promise
  }
  async pagosMes(): Promise<any> {
    const query = `   SELECT 
    TO_CHAR(fecha_transaccion, 'YYYY-MM') AS mes,
    SUM(monto_pagado) AS total_pagado
FROM cotel.transacciones
WHERE estado_transaccion_id = 1010 
GROUP BY mes
ORDER BY mes DESC;`;
    const result = await this.db.manyOrNone(query);
    return result;
  }
  async pagosSemana(): Promise<any> {
    const query = `SELECT 
    DATE_TRUNC('week', fecha_transaccion) AS semana,
    SUM(monto_pagado) AS total_pagado
FROM cotel.transacciones
WHERE estado_transaccion_id = 1010 
GROUP BY semana
ORDER BY semana DESC;`;
    const result = await this.db.manyOrNone(query);
    return result;
  }
  async pagosPorEstado(): Promise<any> {
    const query = ` SELECT 
    d.descripcion AS estado,
    COUNT(*) AS cantidad_transacciones
FROM cotel.transacciones t
JOIN cotel.dominios d ON t.estado_transaccion_id = d.dominio_id
GROUP BY estado
ORDER BY cantidad_transacciones DESC;`;
    const result = await this.db.manyOrNone(query);
    return result;
  }
  async pagosUltimos(pLimit:number): Promise<any> {
    const query = `SELECT 
    transaccion_id,
    monto_pagado,
    moneda,
    fecha_transaccion
FROM cotel.transacciones
WHERE estado_transaccion_id = 1010 
ORDER BY fecha_transaccion DESC
LIMIT $1;`;
    const params = [pLimit];
    const result = await this.db.manyOrNone(query,params);
    return result;
  }

}