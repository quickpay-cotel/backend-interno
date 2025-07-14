import { Injectable, Inject } from '@nestjs/common';
import { IDatabase } from 'pg-promise'; // Usamos pg-promise
@Injectable()
export class UsuarioUsuariosRepository {
  private db: IDatabase<any>;

  constructor(@Inject('DB_CONNECTION') db: IDatabase<any>) {
    this.db = db; // Inyectamos la conexión de pg-promise
  }

  async findByFilters(
    filters: Record<string, any>,
    t?: IDatabase<any>,
  ): Promise<any[]> {
    const keys = Object.keys(filters);
    const values = Object.values(filters);

    // Si no hay filtros, devolver todo
    let whereClause = '';
    if (keys.length > 0) {
      const conditions = keys.map((key, index) => `${key} = $${index + 1}`);
      whereClause = `WHERE ${conditions.join(' AND ')}`;
    }

    const query = `
    SELECT * FROM usuario.usuarios
    ${whereClause}
  `;

    const result = t
      ? await t.any(query, values)
      : await this.db.any(query, values);

    return result;
  }
  async findByUsername(username: string) {
    const query =
      'select * from usuario.usuarios where username=$1 and estado_id = 1000';
    return await this.db.oneOrNone(query, [username]);
  }
    async findByUsuarioId(usuarioId: Number) {
    const query =
      'select * from usuario.usuarios where usuario_id=$1 and estado_id = 1000';
    return await this.db.oneOrNone(query, [usuarioId]);
  }
  async updateToken(usuario_id: number, token: string) {
    const query =
      'update usuario.usuarios set access_token = $1 where usuario_id=$2 and estado_id = 1000';
    return await this.db.oneOrNone(query, [token, usuario_id]);
  }
  async setPassword(usuario_id: number, contrasenia: string) {
    const query =
      'UPDATE usuario.usuarios SET password_hash = $1 WHERE usuario_id = $2';
    return await this.db.oneOrNone(query, [contrasenia, usuario_id]);
  }
  async findByUserName(userName: string) {
    const query = 'select * from usuario.usuarios u where u.estado_id = 1000 and u.username = $1';
    return await this.db.oneOrNone(query, [userName]);
  }
  async findOptionsByUserName(userName: string) {
    const query = `  select o.nombre,o.description,o.url_path from usuario.usuarios u 
    inner join usuario.usuarios_roles ur on ur.usuario_id = u.usuario_id and ur.estado_id = 1000
    inner join usuario.roles_opciones ro on ro.rol_id = ur.rol_id and ro.estado_id = 1000
    inner join usuario.opciones o on o.opcion_id = ro.opcion_id and o.estado_id = 1000
    where u.username = $1`;
    return await this.db.manyOrNone(query, [userName]);
  }
  async findPersonaNaturalByPersonaId(personaId: number) {
    const query =
      "select (pn.nombres ||''|| pn.apellidos) as nombres from usuario.persona_natural pn where pn.persona_natural_id = $1 and estado_id = 1000";
    return await this.db.oneOrNone(query, [personaId]);
  }
  async findPersonaJuridicaByPersonaId(personaId: number) {
    const query =
      'select pj.nombre_empresa as nombres from usuario.persona_juridica  pj where pj.persona_juridica_id = $1 and pj.estado_id = 1000';
    return await this.db.oneOrNone(query, [personaId]);
  }

  async findDatosPersonaAndEmpresa(usuarioId: number) {
    const query = ` select pn.nombres as nombre_usuario, pn.apellidos as apellido_usuario,pj.nombre_empresa, pj.nit as nit_empresa, u.email as correo_usuario,
ec.logo_url as logo_filename , ec.color_primario ,ec.slug_empresa
    from usuario.usuarios u 
    inner join usuario.persona_natural pn on pn.persona_natural_id = u.persona_natural_id and pn.estado_id = 1000
    left join usuario.persona_juridica pj on pj.persona_juridica_id = u.persona_juridica_id and pj.estado_id = 1000
    left join usuario.empresa_configuracion ec on ec.persona_juridica_id = pj.persona_juridica_id and ec.estado_id = 1000
    where u.usuario_id = $1 and u.estado_id = 1000`;
    return await this.db.oneOrNone(query, [usuarioId]);
  }

}
