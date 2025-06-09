import { Module } from "@nestjs/common";
import { UsuarioUsuariosRepository } from "./usuario.usuarios.repository";
import { CotelApiLogRepository } from "./cotel.api.log.repository";
import { CotelDeudasRepository } from "./cotel.deudas.repository";
import { CotelTransacionesRepository } from "./cotel.transacciones.repository";
import { PagosCargasExcelRepository } from "./pagos/pagos.cargas_excel.repository";
import { PagosDeudasRepository } from "./pagos/pagos.deudas.repository";

@Module({
  imports: [], // Importa el ConfigModule para manejar las variables de entorno
  providers: [ UsuarioUsuariosRepository,CotelApiLogRepository,CotelDeudasRepository, CotelTransacionesRepository, PagosCargasExcelRepository, PagosDeudasRepository],
  exports: [ UsuarioUsuariosRepository,CotelApiLogRepository,CotelDeudasRepository,CotelTransacionesRepository,PagosCargasExcelRepository,PagosDeudasRepository]
})
export class RepositoryModule { }
