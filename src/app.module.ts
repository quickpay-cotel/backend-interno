import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseModule } from "./config/database.module"; // Importamos el DatabaseModule
import { UsuariosModule } from './usuarios/usuarios.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Configuración global de ConfigModule
    AuthModule,DatabaseModule, UsuariosModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
