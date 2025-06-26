import { Injectable, Inject } from '@nestjs/common';
import { IDatabase } from 'pg-promise'; // Usamos pg-promise
@Injectable()
export class PagosDeudasRepository {
  private db: IDatabase<any>;

  constructor(@Inject('DB_CONNECTION') db: IDatabase<any>) {
    this.db = db; // Inyectamos la conexión de pg-promise
  }
  async create(data: Record<string, any>, t?: IDatabase<any>): Promise<any> {
    // Extraer los nombres de las columnas y los valores
    const columnas = Object.keys(data);
    const params = Object.values(data);
    // Construir los marcadores de posición ($1, $2, ...)
    const marcadores = columnas.map((_, index) => `$${index + 1}`).join(', ');
    // Crear la consulta SQL dinámica
    const query = `
          INSERT INTO pagos.deudas (${columnas.join(', ')})
          VALUES (${marcadores}) RETURNING *
        `;
    const result = t
      ? await t.one(query, params)
      : await this.db.one(query, params);
    return result;
  }
  async findAllDeudasByUsuarioId(pUsuarioId: number) {
    const query = `select d.* from pagos.deudas d 
    inner join pagos.cargas_excel ce on d.carga_id = ce.carga_id and ce.estado_id = 1000
    where d.estado_id = 1000 and ce.usuario_id = $1
    order by d.fecha_registro desc;`;
    const params = [pUsuarioId];
    const result = await this.db.manyOrNone(query, params);
    return result;
  }
  async findByTipoPagoAndPeriodo(pTipoPago: number, pPeriodo: string) {
    const query = `select d.* from pagos.deudas d where d.tipo_pago_id = $1 and d.periodo = $2 and d.estado_id = 1000;`;
    const params = [pTipoPago, pPeriodo];
    const result = await this.db.manyOrNone(query, params);
    return result;
  }
}
