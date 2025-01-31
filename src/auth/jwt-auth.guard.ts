import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';

  import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  // Inyectamos el servicio JwtService para verificar tokens JWT
  constructor(private jwtService: JwtService) {}

  // Método principal que se ejecuta antes de permitir el acceso a una ruta protegida
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Obtiene el objeto de solicitud HTTP desde el contexto de ejecución
    const request = context.switchToHttp().getRequest();

    // Extrae el token JWT del encabezado Authorization
    const token = this.extractTokenFromHeader(request);

    // Si no hay token, lanza una excepción de "No autorizado"
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      // Verifica la validez del token usando la clave secreta de las variables de entorno
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: process.env.JWT_SECRET, // Secreto utilizado para validar el token
        }
      );

      // Asigna la información decodificada del token al objeto request
      // Esto permite acceder a los datos del usuario en los controladores
      request['user'] = payload;
    } catch {
      // Si la verificación del token falla, lanza una excepción de "No autorizado"
      throw new UnauthorizedException();
    }

    // Si todo es correcto, permite el acceso a la ruta protegida
    return true;
  }

  // Método para extraer el token JWT del encabezado Authorization
  private extractTokenFromHeader(request: Request): string | undefined {
    // Obtiene el valor del encabezado Authorization y lo divide en partes
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    // Devuelve el token solo si el esquema es "Bearer"
    return type === 'Bearer' ? token : undefined;
  }
}
