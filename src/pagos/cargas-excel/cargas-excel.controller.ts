import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CargasExcelService } from './cargas-excel.service';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('cargas-excel')
export class CargasExcelController {

  constructor(private readonly cargasExcelService: CargasExcelService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), 'store', 'deudas')); // Opcionalmente usar directamente aquí también
      },
      filename: (req, file, cb) => {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
      },
    }),
  }))
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    return await this.cargasExcelService.procesarExcel(file);
  }
}
