import { Module } from "@nestjs/common";
import { UsuarioUsuariosRepository } from "./usuario.usuarios.repository";
import { CotelApiLogRepository } from "./cotel.api.log.repository";
import { CotelDeudasRepository } from "./cotel.deudas.repository";
import { CotelTransacionesRepository } from "./cotel.transacciones.repository";

@Module({
  imports: [], // Importa el ConfigModule para manejar las variables de entorno
  providers: [ UsuarioUsuariosRepository,CotelApiLogRepository,CotelDeudasRepository, CotelTransacionesRepository],
  exports: [ UsuarioUsuariosRepository,CotelApiLogRepository,CotelDeudasRepository,CotelTransacionesRepository]
})
export class RepositoryModule { }
