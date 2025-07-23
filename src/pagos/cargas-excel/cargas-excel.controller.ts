import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CargasExcelService } from './cargas-excel.service';
import { diskStorage } from 'multer';
import * as path from 'path';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('cargas-excel')
export class CargasExcelController {
  constructor(private readonly cargasExcelService: CargasExcelService) {}
 
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const fullPath = path.join(process.env.STATIC_FILES_PATH, 'deudas');
          cb(null, fullPath);
        },
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadExcel(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    const usuarioId = req.user.sub;
    const personaJuridicaId = req.user.datosPersona.persona_juridica_id;
    return await this.cargasExcelService.procesarExcel(file, usuarioId,personaJuridicaId);
  }
}
