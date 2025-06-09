import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {


    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    var message = exception instanceof HttpException
      ? exception.getResponse()
      : 'An internal server error occurred';


    response.status(status).json({
      success: false,
      message: typeof message === 'object' ? message['message'] || 'Error procesando la solicitud' : message,
      timestamp: new Date().toISOString(),
    });


  }
}
