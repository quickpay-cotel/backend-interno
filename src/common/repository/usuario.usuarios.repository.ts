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
}