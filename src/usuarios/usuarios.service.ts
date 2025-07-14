import { UsuarioEmpresaConfiguracionRepository } from '../common/repository/usuario/usuario.empresa_configuracion.repository';
import { UsuarioUsuariosRepository } from 'src/common/repository/usuario/usuario.usuarios.repository';
// usuarios.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BcryptService } from 'src/auth/bcrypt.service';
import * as path from 'path';
import * as fs from 'fs';
@Injectable()
export class UsuariosService {
  private readonly saltRounds = 10;

  constructor(
    private readonly usuarioUsuariosRepository: UsuarioUsuariosRepository,
    private readonly usuarioEmpresaConfiguracionRepository: UsuarioEmpresaConfiguracionRepository,
    private readonly bcryptService: BcryptService,
    private readonly usarioEmpresaConfiguracionRepository: UsuarioEmpresaConfiguracionRepository,
  ) {}
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
    await this.usuarioUsuariosRepository.setPassword(usuario.usuario_id, hashedPassword);
  }
  async getOptions(userName: string) {
    try {
      let menus = await this.usuarioUsuariosRepository.findOptionsByUserName(userName);
      if (!menus || menus.length == 0) throw new Error('No tiene opciones o menus asignados');

      return menus;
    } catch (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }
  async obtenerDatosPersonaEmpresa(usuarioId: number) {
    try {
      let datosPersonaEmpresa = await this.usuarioUsuariosRepository.findDatosPersonaAndEmpresa(usuarioId);
      if (!datosPersonaEmpresa || datosPersonaEmpresa.length == 0) throw new Error('No tiene datos persona y empresa');

      return datosPersonaEmpresa;
    } catch (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }
  async obtenerConfiguracionEmpresa(usuarioId: number) {
    try {
      let user: any = await this.usuarioUsuariosRepository.findByUsuarioId( usuarioId);
      if (!user) throw new Error('Usuario no encontrado');
      if (user.persona_juridica_id) {
        let configuracionEmpresaTodos: any = await this.usarioEmpresaConfiguracionRepository.findByFilters({
          persona_juridica_id: user.persona_juridica_id,
          estado_id: 1000,
        });
        let configuracionEmpresa = null;
        if (Array.isArray(configuracionEmpresaTodos) && configuracionEmpresaTodos.length > 0) {
          configuracionEmpresa = {
            logo_url: configuracionEmpresaTodos[0].logo_url,
            //logo_base64: configuracionEmpresaTodos[0].logo_base64,
            color_primario: configuracionEmpresaTodos[0].color_primario,
            color_secundario: configuracionEmpresaTodos[0].color_secundario,
            color_texto: configuracionEmpresaTodos[0].color_texto,
          };
          return configuracionEmpresa;
        }
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  async actualizarLogo(username: string, file: Express.Multer.File) {
    try {
      const usuario: any = await this.usuarioUsuariosRepository.findByUserName(username);
      if (!usuario) throw new Error('Usuario no existe');
      if (!usuario.persona_juridica_id) throw new Error('Usuario no es empresa');

      if (!file.mimetype.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen');
      }

      const ext = path.extname(file.originalname) || '.png';
      const nuevoNombre = `empresa-${usuario.persona_juridica_id}${ext}`;
      const nuevaRuta = path.join(path.dirname(file.path), nuevoNombre);

      await fs.promises.rename(file.path, nuevaRuta);

      // Leer y codificar la imagen a base64
      const buffer = await fs.promises.readFile(nuevaRuta);
      const base64 = `data:${file.mimetype};base64,${buffer.toString('base64')}`;

      const empresaConfiguracion = await this.usuarioEmpresaConfiguracionRepository.findByPersonaJuridica(usuario.persona_juridica_id);

      if (!empresaConfiguracion) {
        await this.usuarioEmpresaConfiguracionRepository.create({
          persona_juridica_id: usuario.persona_juridica_id,
          logo_url: nuevoNombre,
          logo_base64: base64,
          estado_id: 1000,
        });
      } else {
        await this.usuarioEmpresaConfiguracionRepository.update(parseInt(empresaConfiguracion.empresa_configuracion_id), {
          logo_url: nuevoNombre,
          logo_base64: base64,
        });
      }

      return nuevoNombre;
    } catch (error) {
      throw new HttpException(error.message || error, HttpStatus.BAD_REQUEST);
    }
  }

  async actualizarColorPrimario(color: string, username: string) {
    try {
      const usuario: any = await this.usuarioUsuariosRepository.findByUserName(username);
      if (!usuario) throw new Error('Usuario no existe');
      if (!usuario.persona_juridica_id) throw new Error('Usuario no es empresa');

      const empresaConfiguracion = await this.usuarioEmpresaConfiguracionRepository.findByPersonaJuridica(usuario.persona_juridica_id);

      if (!empresaConfiguracion) {
        await this.usuarioEmpresaConfiguracionRepository.create({
          persona_juridica_id: usuario.persona_juridica_id,
          color_primario: color,
          estado_id: 1000,
        });
      } else {
        await this.usuarioEmpresaConfiguracionRepository.update(parseInt(empresaConfiguracion.empresa_configuracion_id), {
          color_primario: color,
        });
      }
      return color;
    } catch (error) {
      throw new HttpException(error.message || error, HttpStatus.BAD_REQUEST);
    }
  }
  
  async actualizarColorSecundario(color: string, username: string) {
    try {
      const usuario: any = await this.usuarioUsuariosRepository.findByUserName(username);
      if (!usuario) throw new Error('Usuario no existe');
      if (!usuario.persona_juridica_id) throw new Error('Usuario no es empresa');

      const empresaConfiguracion = await this.usuarioEmpresaConfiguracionRepository.findByPersonaJuridica(usuario.persona_juridica_id);

      if (!empresaConfiguracion) {
        await this.usuarioEmpresaConfiguracionRepository.create({
          persona_juridica_id: usuario.persona_juridica_id,
          color_secundario: color,
          estado_id: 1000,
        });
      } else {
        await this.usuarioEmpresaConfiguracionRepository.update(parseInt(empresaConfiguracion.empresa_configuracion_id), {
          color_secundario: color,
        });
      }
      return color;
    } catch (error) {
      throw new HttpException(error.message || error, HttpStatus.BAD_REQUEST);
    }
  }
  async actualizarSlugEmpresa(slug: string, username: string) {
    try {
      const usuario: any = await this.usuarioUsuariosRepository.findByUserName(username);
      if (!usuario) throw new Error('Usuario no existe');
      if (!usuario.persona_juridica_id) throw new Error('Usuario no es empresa');

      const empresaConfiguracion = await this.usuarioEmpresaConfiguracionRepository.findByPersonaJuridica(usuario.persona_juridica_id);

      if (!empresaConfiguracion) {
        await this.usuarioEmpresaConfiguracionRepository.create({
          persona_juridica_id: usuario.persona_juridica_id,
          slug_empresa: slug,
          estado_id: 1000,
        });
      } else {
        await this.usuarioEmpresaConfiguracionRepository.update(parseInt(empresaConfiguracion.empresa_configuracion_id), {
          slug_empresa: slug,
        });
      }
      return slug;
    } catch (error) {
      throw new HttpException(error.message || error, HttpStatus.BAD_REQUEST);
    }
  }
}
