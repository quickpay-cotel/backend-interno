import { Controller, Get, Post, UseGuards,Request, Body, Res, Param } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import {  ReservasService } from "./reservas.service";
import { ConsultaPagosDto } from "./dto/consulta-pagos.dto";
import { JasperService } from "./jasper.service";
import * as fs from 'fs';
@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService, 
              private readonly jasperService:JasperService
  ) { }


  @Post("pagos-realizados")
  @UseGuards(JwtAuthGuard) // Protege el endpoint con el guardia JWT
  async pagosRealizados(@Body() consultaPagosDto: ConsultaPagosDto) {
      return await this.reservasService.findPagosRealizados(consultaPagosDto);
  }


  
  @Post('/pagos-realizados/descargar/:ext')
  async descargarReporte(@Body() consultaPagosDto: ConsultaPagosDto,@Param("ext") ext: string,@Res() res: any) {

    const filePath = await this.jasperService.generateReport(consultaPagosDto,ext);
    const fileName = 'pagos_realizados.'+ext; // Nombre del archivo a descargar

    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('El archivo no existe');
    }

    // Enviar el archivo como descarga
    res.download(filePath, fileName, (err) => {
      if (err) {
        res.status(500).send('Error al descargar el archivo');
      }
    });
  }
}