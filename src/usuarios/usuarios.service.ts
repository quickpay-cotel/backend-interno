import { UsuarioUsuariosRepository } from 'src/common/repository/usuario.usuarios.repository';
// usuarios.service.ts
import { Injectable } from '@nestjs/common';
import { BcryptService } from 'src/auth/bcrypt.service';

@Injectable()
export class UsuariosService {
  private readonly saltRounds = 10;

  constructor(
    private readonly usuarioUsuariosRepository: UsuarioUsuariosRepository,
    private readonly bcryptService: BcryptService,
  ) {

  }
  async findByUsername(username: string) {
    let user = await this.usuarioUsuariosRepository.findByUsername(username);
    return user;
  }
  async updateToken(usuario_id: number, token: string) {
    let user = await this.usuarioUsuariosRepository.updateToken(usuario_id, token);
    return user;
  }
  async setPassword(userName: string, plainPassword: string): Promise<void> {
    const hashedPassword = await this.bcryptService.hashPassword(plainPassword);
    let usuario = await this.usuarioUsuariosRepository.findByUserName(userName);
    await this.usuarioUsuariosRepository.setPassword(usuario.usuario_id, hashedPassword)
  }
}