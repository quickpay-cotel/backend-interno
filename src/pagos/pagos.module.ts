
import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { RepositoryModule } from "src/common/repository/repository.module";
import { CargasExcelService } from "./cargas-excel/cargas-excel.service";
import { CargasExcelController } from "./cargas-excel/cargas-excel.controller";
import { DeudasController } from "./deudas/deudas.controller";
import { DeudasService } from "./deudas/deudas.service";
import { DominiosController } from "./dominios/dominios.controller";
import { DominioService } from "./dominios/dominios.service";
import { ExternalServiceModule } from "src/common/external-services/external-service.module";
import { CobrosPendientesController } from "./deudas/cobros_pendientes.controller";
import { CobrosPendientesService } from "./deudas/cobros_pendientes.service";
import { CobrosCajaController } from "./deudas/cobros_caja.controller";
import { CobrosCajaService } from "./deudas/cobros_caja.service";

@Module({
    imports: [RepositoryModule,AuthModule,ExternalServiceModule],
    controllers: [CargasExcelController, DeudasController, DominiosController,CobrosPendientesController,CobrosCajaController],
    providers: [CargasExcelService, DeudasService, DominioService,CobrosPendientesService,CobrosCajaService],
    exports: []
})
export class PagosModule { }