import { Controller, Get, Post, UseGuards,Request, Body, Res, Param } from "@nestjs/common";

import * as fs from 'fs';
import { IllaService } from "./illa.service";
@Controller('illa')
export class IllaController {
  constructor(private readonly illaService: IllaService
  ) { }
  @Post("documentos-ajuste")
  async pagosRealizados(@Body() payload: any) {
      return await this.illaService.notaConciliacion(payload);
  }
}