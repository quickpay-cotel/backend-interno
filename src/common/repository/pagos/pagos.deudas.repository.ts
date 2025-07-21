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
    const result = t ? await t.one(query, params) : await this.db.one(query, params);
    return result;
  }
  async update(id: number, data: Record<string, any>, t?: IDatabase<any>): Promise<any> {
    const columnas = Object.keys(data);
    const valores = Object.values(data);

    if (columnas.length === 0) {
      throw new Error('No hay campos para actualizar');
    }

    // Construir SET dinámicamente: "col1 = $1, col2 = $2, ..."
    const setClause = columnas.map((col, index) => `${col} = $${index + 1}`).join(', ');

    // Último parámetro es el ID
    const query = `
    UPDATE pagos.deudas
    SET ${setClause}
    WHERE deuda_id = $${columnas.length + 1}
    RETURNING *
  `;

    const params = [...valores, id];

    const result = t ? await t.one(query, params) : await this.db.one(query, params);

    return result;
  }

  async findByFilters(filters: Record<string, any>, t?: IDatabase<any>): Promise<any[]> {
    const keys = Object.keys(filters);
    const values = Object.values(filters);

    // Si no hay filtros, devolver todo
    let whereClause = '';
    if (keys.length > 0) {
      const conditions = keys.map((key, index) => `${key} = $${index + 1}`);
      whereClause = `WHERE ${conditions.join(' AND ')}`;
    }

    const query = `
    SELECT * FROM pagos.deudas
    ${whereClause}
  `;

    const result = t ? await t.any(query, values) : await this.db.any(query, values);

    return result;
  }
  async datosClienteByCriterioBusqueda(parametroBusqueda: string, tipoPago: number): Promise<any> {
    const query = ` 
    select d.* from pagos.deudas d where (d.codigo_cliente ILIKE  $1 or d.numero_documento ILIKE  $1 or d.nombre_completo ILIKE  $1) 
    and d.estado_id = 1000 and d.tipo_pago_id = $2 order by d.periodo desc;
    `;
    const params = [`%${parametroBusqueda}%`, tipoPago];
    const result = await this.db.many(query, params);
    return result;
  }

  // me todo que pemrmite buscar cobros pendinetes en funcion a COD CLIENTE Y NRO DOCUMENTO
  async cobrosPendientesByCriterioBusqueda(parametroBusqueda: string, tipoPago: number): Promise<any> {
    const query = ` 
  select d.deuda_id,d.carga_id,d.codigo_cliente,d.nombre_completo,d.tipo_documento,d.numero_documento,d.complemento_documento,d.tipo_pago_id,	
  d.periodo,d.codigo_producto,d.codigo_producto_sin,d.descripcion,d.cantidad,d.precio_unitario,d.monto_descuento, (d.cantidad*d.precio_unitario-d.monto_descuento) as monto_total,
  d.email,d.telefono,d.fecha_registro
       from pagos.deudas d 
   where (d.codigo_cliente ILIKE  $1 or d.numero_documento ILIKE  $1 or d.nombre_completo ILIKE  $1) 
    and d.estado_id = 1000 and d.tipo_pago_id = $2
    and not exists(
      select * from pagos.reserva_deuda rd
	 inner join pagos.datosconfirmado_qr dc on dc.qr_generado_id = rd.qr_generado_id and rd.estado_id = 1000
	 inner join pagos.transacciones t on t.datosconfirmado_qr_id  = dc.datosconfirmado_qr_id and t.estado_id = 1000
	 where  rd.deuda_id = d.deuda_id and rd.estado_id = 1000
    )and not exists(
      select * from pagos.transaccion_deuda td
	 inner join pagos.transacciones t on t.transaccion_id  = td.transaccion_id and t.estado_id = 1000
	 where  td.deuda_id = d.deuda_id and td.estado_id = 1000
    )  order by d.periodo desc;
    `;
    const params = [`%${parametroBusqueda}%`, tipoPago];
    const result = await this.db.many(query, params);
    return result;
  }

  async findAllDeudasEmpresaByUsuarioId(pUsuarioId: number) {
    const query = `
select 
    d.deuda_id,d.codigo_cliente,d.nombre_completo,
    d.tipo_documento, d.numero_documento,d.complemento_documento,
    d.tipo_pago_id, tipoPago.descripcion as tipo_pago,d.codigo_producto,
    d.codigo_producto_sin,d.descripcion,d.periodo,d.cantidad,
    d.precio_unitario,d.monto_descuento,d.email,d.telefono,d.fecha_registro
from  pagos.deudas d
inner join pagos.cargas_excel ce on d.carga_id = ce.carga_id and ce.estado_id = 1000
inner join pagos.dominios tipoPago on tipoPago.dominio_id = d.tipo_pago_id
inner join usuario.usuarios u on u.usuario_id = ce.usuario_id
where d.estado_id = 1000 and u.persona_juridica_id = (
        select persona_juridica_id  
        from usuario.usuarios  
        where usuario_id = $1
        limit 1
    )
    and (
    -- que no este pagado en caja
    not exists (
        select 1 
        from pagos.transaccion_deuda td
        inner join pagos.transacciones t on t.transaccion_id  = td.transaccion_id and t.estado_id = 1000
        where td.deuda_id = d.deuda_id 
        and td.estado_id = 1000
    ) -- que no este pagado por QR
    and not exists(
    	 select 1 
        from pagos.reserva_deuda r  
        inner join pagos.datosconfirmado_qr dc on dc.qr_generado_id  = r.qr_generado_id and dc.estado_id = 1000
        inner join pagos.transacciones t on t.datosconfirmado_qr_id = dc.datosconfirmado_qr_id and t.estado_id = 1000
        where r.deuda_id = d.deuda_id 
        and r.estado_id = 1000
    )
    )order by   d.fecha_registro desc;`;
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
  async findByDeudasIds(deudasIds: number[]) {
    const query = `select d.* from pagos.deudas d where d.deuda_id  IN ($1:csv) and  d.estado_id = 1000;`;
    const result = await this.db.manyOrNone(query, [deudasIds]);
    return result;
  }

  async cobrosPendientesByDeudasIds(deudasIds: number[]): Promise<any> {
    const query = `
    select d.deuda_id,d.carga_id,d.codigo_cliente,d.nombre_completo,d.tipo_documento,d.numero_documento,d.complemento_documento,d.tipo_pago_id,	
  d.periodo,d.codigo_producto,d.codigo_producto_sin,d.descripcion,d.cantidad,d.precio_unitario,d.monto_descuento, (d.cantidad*d.precio_unitario-d.monto_descuento) as monto_total,
  d.email,d.telefono,d.fecha_registro
       from pagos.deudas d 
   where d.deuda_id in ($1:csv) and d.estado_id = 1000  and not exists(
      select * from pagos.reserva_deuda rd
	 inner join pagos.datosconfirmado_qr dc on dc.qr_generado_id = rd.qr_generado_id and rd.estado_id = 1000
	 inner join pagos.transacciones t on t.datosconfirmado_qr_id  = dc.datosconfirmado_qr_id and t.estado_id = 1000
	 where  rd.deuda_id = d.deuda_id and rd.estado_id = 1000
    ) order by d.periodo desc;
  `;
    const result = await this.db.manyOrNone(query, [deudasIds]);
    return result;
  }
}
