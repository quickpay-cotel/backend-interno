import { Controller, Get, Post, UseGuards,Request } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import {  LogService } from "./log.service";

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) { }

  @Get('consultas-externas')
  @UseGuards(JwtAuthGuard) // Protege el endpoint con el guardia JWT
  async getOptions(@Request() req) {
    return await this.logService.findAll();
  }
}