import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseModule } from "./config/database.module"; // Importamos el DatabaseModule
import { UsuariosModule } from './usuarios/usuarios.module';
import { ConfigModule } from '@nestjs/config';
import { LogModule } from './consulta-apis/log.module';
import { ReservasModule } from './pagos/reservas.module';
import { IllaModule } from './illa/illa.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Configuración global de ConfigModule
    AuthModule,DatabaseModule, UsuariosModule, LogModule, ReservasModule,IllaModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
