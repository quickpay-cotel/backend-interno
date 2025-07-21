
import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { RepositoryModule } from "src/common/repository/repository.module";
import { CargasExcelService } from "./cargas-excel/cargas-excel.service";
import { CargasExcelController } from "./cargas-excel/cargas-excel.controller";

import { DominiosController } from "./dominios/dominios.controller";
import { DominioService } from "./dominios/dominios.service";
import { ExternalServiceModule } from "src/common/external-services/external-service.module";
import { CobrosPendientesController } from "./deudas/cobros_pendientes.controller";
import { CobrosPendientesService } from "./deudas/cobros_pendientes.service";
import { CobrosCajaController } from "./deudas/cobros_caja.controller";
import { CobrosCajaService } from "./deudas/cobros_caja.service";
import { CobrosRealizadoController } from "./pagos/cobros_realizado.controller";
import { CobrosRealizadoService } from "./pagos/cobros_realizado.service";
import { ReportesJasperController } from "./pagos/reportes_jasper.controller";
import { ReportesJasperService } from "./pagos/reportes_jasper.service";

@Module({
    imports: [RepositoryModule,AuthModule,ExternalServiceModule],
    controllers: [CargasExcelController, DominiosController,CobrosPendientesController,CobrosCajaController, CobrosRealizadoController,ReportesJasperController],
    providers: [CargasExcelService, DominioService,CobrosPendientesService,CobrosCajaService,CobrosRealizadoService,ReportesJasperService],
    exports: []
})
export class PagosModule { }