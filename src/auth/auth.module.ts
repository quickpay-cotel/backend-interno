import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsuariosService } from '../usuarios/usuarios.service';
import { RepositoryModule } from 'src/common/repository/repository.module';
import { BcryptService } from './bcrypt.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
@Module({
  imports: [
    JwtModule.register({
      global:true,
      secret: '8Ls!xv2PLD92jRzm$NfQ9gT7qW' ,
      signOptions: { expiresIn:'1h' },
    }),
    PassportModule,
    RepositoryModule
  ],
  providers: [AuthService, JwtStrategy, UsuariosService,BcryptService],
  exports: [AuthService, JwtStrategy,BcryptService],  // Exporta los servicios para usarlos en otros módulos
  controllers:[AuthController]
})
export class AuthModule {}
