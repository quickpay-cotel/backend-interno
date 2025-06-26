
import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { RepositoryModule } from "src/common/repository/repository.module";
import { CargasExcelService } from "./cargas-excel/cargas-excel.service";
import { CargasExcelController } from "./cargas-excel/cargas-excel.controller";
import { DeudasController } from "./deudas/deudas.controller";
import { DeudasService } from "./deudas/deudas.service";
@Module({
    imports: [RepositoryModule,AuthModule],
    controllers: [CargasExcelController, DeudasController],
    providers: [CargasExcelService, DeudasService],
    exports: []
})
export class PagosModule { }