// auth.controller.ts
import { Controller, Post, Body, Get, UseGuards, Request, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuariosService: UsuariosService) { }

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
}