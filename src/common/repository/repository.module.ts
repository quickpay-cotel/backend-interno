import { Module } from "@nestjs/common";
import { UsuarioUsuariosRepository } from "./usuario/usuario.usuarios.repository";
import { CotelApiLogRepository } from "./cotel.api.log.repository";
import { CotelDeudasRepository } from "./cotel.deudas.repository";
import { CotelTransacionesRepository } from "./cotel.transacciones.repository";
import { PagosCargasExcelRepository } from "./pagos/pagos.cargas_excel.repository";
import { PagosDeudasRepository } from "./pagos/pagos.deudas.repository";
import { UsuarioEmpresaConfiguracionRepository } from "./usuario/usuario.empresa_configuracion.repository";

@Module({
  imports: [], // Importa el ConfigModule para manejar las variables de entorno
  providers: [ UsuarioUsuariosRepository,CotelApiLogRepository,CotelDeudasRepository, CotelTransacionesRepository, PagosCargasExcelRepository, PagosDeudasRepository,UsuarioEmpresaConfiguracionRepository],
  exports: [ UsuarioUsuariosRepository,CotelApiLogRepository,CotelDeudasRepository,CotelTransacionesRepository,PagosCargasExcelRepository,PagosDeudasRepository,UsuarioEmpresaConfiguracionRepository]
})
export class RepositoryModule { }
