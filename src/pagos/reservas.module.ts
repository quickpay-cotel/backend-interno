import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { RepositoryModule } from "src/common/repository/repository.module";
import { ReservasController } from "./reservas.controller";
import {  ReservasService } from "./reservas.service";
import { JasperService } from "./jasper.service";
@Module({
    imports: [RepositoryModule,AuthModule],
    controllers: [ReservasController],
    providers: [ReservasService, JasperService],
    exports: []
})
export class ReservasModule { }