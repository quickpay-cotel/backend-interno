import { Module } from "@nestjs/common";
import { UsuarioUsuariosRepository } from "./usuario.usuarios.repository";

@Module({
  imports: [], // Importa el ConfigModule para manejar las variables de entorno
  providers: [ UsuarioUsuariosRepository],
  exports: [ UsuarioUsuariosRepository]
})
export class RepositoryModule { }
