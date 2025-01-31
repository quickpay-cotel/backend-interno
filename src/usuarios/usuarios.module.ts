
import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { RepositoryModule } from "src/common/repository/repository.module";
import { UsuariosService } from "./usuarios.service";
import { UsuarioController } from "./usuario.controller";
@Module({
    imports: [RepositoryModule,AuthModule],
    controllers: [UsuarioController],
    providers: [UsuariosService],
    exports: []
})
export class UsuariosModule { }