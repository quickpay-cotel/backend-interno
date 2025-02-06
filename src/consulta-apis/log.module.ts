import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { RepositoryModule } from "src/common/repository/repository.module";
import { LogController } from "./log.controller";
import { LogService } from "./log.service";
@Module({
    imports: [RepositoryModule,AuthModule],
    controllers: [LogController],
    providers: [LogService],
    exports: []
})
export class LogModule { }