
import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { RepositoryModule } from "src/common/repository/repository.module";
import { CargasExcelService } from "./cargas-excel/cargas-excel.service";
import { CargasExcelController } from "./cargas-excel/cargas-excel.controller";
@Module({
    imports: [RepositoryModule,AuthModule],
    controllers: [CargasExcelController],
    providers: [CargasExcelService],
    exports: []
})
export class PagosModule { }