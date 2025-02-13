import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from "dotenv";
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/interceptors/http-exception.filter';
dotenv.config(); // Carga las variables de entorno
import * as fs from 'fs';

async function bootstrap() {
  let app;

  if (process.env.NODE_ENV === 'production') {
    // Configuración con SSL en servidor
    const httpsOptions = {
      key: fs.readFileSync('/etc/ssl/quickpay.com.bo/private.key'),
      cert: fs.readFileSync('/etc/ssl/quickpay.com.bo/certificate.crt'),
      ca: fs.readFileSync('/etc/ssl/quickpay.com.bo/ca_bundle.crt'), // Si tienes un certificado intermedio
    };
    app = await NestFactory.create(AppModule, { httpsOptions });
  } else {
    // Configuración sin SSL en local
    app = await NestFactory.create(AppModule);
  }

  app.enableCors();
  app.useGlobalInterceptors(new ResponseInterceptor()); // Para estandarizar las respuestas
  app.useGlobalFilters(new HttpExceptionFilter()); // Para las respuestas de error

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server running on ${process.env.NODE_ENV === 'production' ? 'HTTPS' : 'HTTP'} at port ${port}`);
}

bootstrap();

