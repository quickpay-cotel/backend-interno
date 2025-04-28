import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { RepositoryModule } from "src/common/repository/repository.module";
import { IllaController } from "./illa.controller";
import { IllaService } from "./illa.service";


@Module({
    imports: [RepositoryModule,AuthModule],
    controllers: [IllaController],
    providers: [IllaService],
    exports: []
})
export class IllaModule { }