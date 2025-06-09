import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { RepositoryModule } from "src/common/repository/repository.module";
import { ReservasController } from "./reservas.controller";
import {  ReservasService } from "./reservas.service";
import { JasperService } from "./jasper.service";
import { TransactionController } from "./transactions.controller";
import { TransactionService } from "./trsansactions.service";
@Module({
    imports: [RepositoryModule,AuthModule],
    controllers: [ReservasController,TransactionController],
    providers: [ReservasService, JasperService,TransactionService],
    exports: []
})
export class ReservasModule { }