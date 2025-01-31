import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
 private readonly authService:AuthService,

  ) {}

  @Post('login')
  async login(@Body() userCredentials: any) {
    return  await this.authService.login(userCredentials.username,userCredentials.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}