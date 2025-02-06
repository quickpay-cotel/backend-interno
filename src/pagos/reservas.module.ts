import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { RepositoryModule } from "src/common/repository/repository.module";
import { ReservasController } from "./reservas.controller";
import {  ReservasService } from "./reservas.service";
@Module({
    imports: [RepositoryModule,AuthModule],
    controllers: [ReservasController],
    providers: [ReservasService],
    exports: []
})
export class ReservasModule { }