import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './config/database.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PagosModule } from './pagos/pagos.module';
import { ConfigModule } from '@nestjs/config';
import { LogModule } from './consulta-apis/log.module';
import { ReservasModule } from './cotel/reservas.module';
import { IllaModule } from './illa/illa.module';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'store'),  // Carpeta física con imágenes
      serveRoot: '/store',                        // Ruta pública para acceder
    }),
    AuthModule,
    DatabaseModule,
    UsuariosModule,
    LogModule,
    ReservasModule,
    IllaModule,
    PagosModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
