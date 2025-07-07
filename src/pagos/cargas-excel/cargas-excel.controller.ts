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
  @UseGuards(JwtAuthGuard) // Protege el endpoint con el guardia JWT
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, path.join(process.cwd(), 'store', 'deudas'));
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
    const user = req.user.sub; // Aquí está el usuario del token
    return await this.cargasExcelService.procesarExcel(file, user);
  }
}
