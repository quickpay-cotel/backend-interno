import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {

        // Cambiar el código de estado a 200
        response.status(200);

        // Modificar la respuesta dependiendo del endpoint
        const request = context.switchToHttp().getRequest();
      
        return {
          success: true,
          message: "Exito",
          result: data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
