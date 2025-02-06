import { Injectable, Inject } from "@nestjs/common";
import { IDatabase } from "pg-promise"; // Usamos pg-promise
@Injectable()
export class UsuarioUsuariosRepository {
  private db: IDatabase<any>;

  constructor(@Inject("DB_CONNECTION") db: IDatabase<any>) {
    this.db = db; // Inyectamos la conexión de pg-promise
  }

  async findByUsername(username: string) {
    const query = 'select * from usuario.usuarios where username=$1 and estado_id = 1000';
    return await this.db.oneOrNone(query, [username]);
  }
  async updateToken(usuario_id: number, token: string) {
    const query = 'update usuario.usuarios set access_token = $1 where usuario_id=$2 and estado_id = 1000';
    return await this.db.oneOrNone(query, [token,usuario_id]);
  }
  async setPassword(usuario_id: number, contrasenia: string) {
    const query = 'UPDATE usuario.usuarios SET password_hash = $1 WHERE usuario_id = $2';
    return await this.db.oneOrNone(query, [contrasenia,usuario_id]);
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
  async findPersonaNaturalByPersonaId(personaId:number){
    const query = "select (pn.nombres ||''|| pn.apellidos) as nombres from usuario.persona_natural pn where pn.persona_natural_id = $1 and estado_id = 1000";
    return await this.db.oneOrNone(query, [personaId]);
  }
  async findPersonaJuridicaByPersonaId(personaId:number){
    const query = 'select pj.nombre_empresa as nombres from usuario.persona_juridica  pj where pj.persona_juridica_id = $1 and pj.estado_id = 1000';
    return await this.db.oneOrNone(query, [personaId]);
  }
}