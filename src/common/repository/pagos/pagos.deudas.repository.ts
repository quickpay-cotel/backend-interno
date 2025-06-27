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
  async update(
    id: number,
    data: Record<string, any>,
    t?: IDatabase<any>,
  ): Promise<any> {
    const columnas = Object.keys(data);
    const valores = Object.values(data);

    if (columnas.length === 0) {
      throw new Error('No hay campos para actualizar');
    }

    // Construir SET dinámicamente: "col1 = $1, col2 = $2, ..."
    const setClause = columnas
      .map((col, index) => `${col} = $${index + 1}`)
      .join(', ');

    // Último parámetro es el ID
    const query = `
    UPDATE pagos.deudas
    SET ${setClause}
    WHERE deuda_id = $${columnas.length + 1}
    RETURNING *
  `;

    const params = [...valores, id];

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
  async findById(pDeudaId: number) {
    const query = `select d.* from pagos.deudas d 
    where d.estado_id = 1000 and d.deuda_id = $1;`;
    const params = [pDeudaId];
    const result = await this.db.oneOrNone(query, params);
    return result;
  }
  async findByTipoPagoAndPeriodo(pTipoPago: number, pPeriodo: string) {
    const query = `select d.* from pagos.deudas d where d.tipo_pago_id = $1 and d.periodo = $2 and d.estado_id = 1000;`;
    const params = [pTipoPago, pPeriodo];
    const result = await this.db.manyOrNone(query, params);
    return result;
  }
}
