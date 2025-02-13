import { Transform } from "class-transformer";
import { IsIn, IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";

export class ConsultaApiLogDto {
  @IsString()
  empresa: string;
  @IsString()
  api: string;
  @IsString()
  status: string;
  @IsString()
  fechaInicio: Date;
  @IsString()
  fechaFin: Date;
}
