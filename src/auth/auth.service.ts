import { UsuarioEmpresaConfiguracionRepository } from './../common/repository/usuario/usuario.empresa_configuracion.repository';
import { BcryptService } from 'src/auth/bcrypt.service';
import { UsuarioUsuariosRepository } from 'src/common/repository/usuario/usuario.usuarios.repository';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioUsuariosRepository: UsuarioUsuariosRepository,
    
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    // Buscar usuario en la base de datos
    const user = await this.usuarioUsuariosRepository.findByUserName(username);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar contraseña
    const isPasswordValid = await this.bcryptService.comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    let datosPersona = null;
    if (user.persona_natural_id && !user.persona_juridica_id) {
      datosPersona = await this.usuarioUsuariosRepository.findPersonaNaturalByPersonaId(user.persona_natural_id);
    } else {
      datosPersona = await this.usuarioUsuariosRepository.findPersonaJuridicaByPersonaId(user.persona_juridica_id);
    }

  

    // Generar payload para el token
    const payload = { sub: user.usuario_id, username: user.username, datosPersona: datosPersona };

    // Firmar el token con una expiración de 1h (ajustable)
    const token = await this.jwtService.signAsync(payload, { expiresIn: '1h' });

    return { access_token: token };
  }
}
