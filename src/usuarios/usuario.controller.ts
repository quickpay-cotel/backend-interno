// auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  UseInterceptors,
  HttpException,
  HttpStatus,
  UploadedFile,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
//import path from 'path';
import * as path from 'path';
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('set-password')
  async setPassword(@Body() loginDto: { username: string; password: string }) {
    const user = await this.usuariosService.setPassword(
      loginDto.username,
      loginDto.password,
    );
  }
  @Get('get-options')
  @UseGuards(JwtAuthGuard) // Protege el endpoint con el guardia JWT
  async getOptions(@Request() req) {
    return await this.usuariosService.getOptions(req.user.username);
  }

  @Get('obtener-datos-persona-empresa')
  @UseGuards(JwtAuthGuard) // Protege el endpoint con el guardia JWT
  async obtenerDatosPersona(@Request() req) {
    return await this.usuariosService.obtenerDatosPersonaEmpresa(req.user.sub);
  }
  @Get('obtener-configuracion-empresa')
  @UseGuards(JwtAuthGuard) // Protege el endpoint con el guardia JWT
  async obtenerConfiguracionEmprsa(@Request() req) {
    return await this.usuariosService.obtenerConfiguracionEmpresa(req.user.sub);
  }
  @Post('upload-logo')
  @UseGuards(JwtAuthGuard) // Protege el endpoint con el guardia JWT
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const logoPath = path.join(process.env.STATIC_FILES_PATH, 'store', 'logos');
          cb(null, logoPath);
        },
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    }),
  )
  async uploadLogo(@UploadedFile() file: Express.Multer.File, @Request() req) {
    return await this.usuariosService.actualizarLogo(req.user.username, file);
  }

  @Post('guardar-color-primario')
  @UseGuards(JwtAuthGuard)
  async guardarColorPrimario(@Body() body: { color: string }, @Request() req: any) {
    return await this.usuariosService.actualizarColorPrimario(body.color, req.user.username);
  }
  @Post('guardar-color-secundario')
  @UseGuards(JwtAuthGuard)
  async guardarColorSecundario(@Body() body: { color: string }, @Request() req: any) {
    return await this.usuariosService.actualizarColorSecundario(body.color, req.user.username);
  }
  @Post('guardar-slug-empresa')
  @UseGuards(JwtAuthGuard)
  async guardarSlugEmpresa(
    @Body() body: { slug: string },
    @Request() req: any,
  ) {
    await this.usuariosService.actualizarSlugEmpresa(
      body.slug,
      req.user.username,
    );
    return { success: true };
  }
}
