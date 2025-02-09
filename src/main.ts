import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from "dotenv";
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/interceptors/http-exception.filter';
dotenv.config(); // Carga las variables de entorno

import * as fs from "fs";

async function bootstrap() {


  const httpsOptions = {
    key: fs.readFileSync('/etc/ssl/quickpay.com.bo/private.key'),
    cert: fs.readFileSync('/etc/ssl/quickpay.com.bo/certificate.crt'),
    ca: fs.readFileSync('/etc/ssl/quickpay.com.bo/ca_bundle.crt'), // Si tienes un certificado intermedio
  };
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  //const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalInterceptors(new ResponseInterceptor()); // para standrizar las respuestas
  app.useGlobalFilters(new HttpExceptionFilter); // para las respuesats de error
  await app.listen(process.env.PORT);
}
bootstrap();
