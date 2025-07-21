import { ReportesJasperService } from './reportes_jasper.service';
import { Controller, Get, Post, UseGuards, Request, Body, Res, Param } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { RequestCobrosRealizadoDto } from './dto/request/request_cobros_realizado.dto';
@Controller('reportes_jasper')
export class ReportesJasperController {
  constructor(private readonly reportesJasperService: ReportesJasperService) {}

  @Post('/cobros-realizados/descargar/:ext')
  @UseGuards(JwtAuthGuard)
  async descargarReporte(@Body() requestCobrosRealizadoDto: RequestCobrosRealizadoDto, @Param('ext') ext: string, @Res() res: Response, @Request() req) {
    const usuarioId = req.user.sub;
    try {
      const pdfBuffer = await this.reportesJasperService.generateReport(usuarioId, requestCobrosRealizadoDto, ext);

      const fileName = `cobros_realizados.${ext}`;

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': pdfBuffer.length,
      });

      return res.send(pdfBuffer);
    } catch (error) {
      console.error('Error al descargar reporte:', error);
      const statusCode = error.status || 500;
      return res.status(statusCode).send(error.message || 'Error inesperado al generar el reporte');
    }
  }
}
