import { RequestCobrosRealizadoDto } from './dto/request/request_cobros_realizado.dto';
import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { PagosTransaccionesRepository } from 'src/common/repository/pagos/pagos.transacciones.repository';
import axios from 'axios';
import { UsuarioUsuariosRepository } from 'src/common/repository/usuario/usuario.usuarios.repository';
import { FuncionesGenerales } from 'src/common/utils/funciones.generales';
@Injectable()
export class ReportesJasperService {
  constructor(
    private readonly pagosTransaccionesRepository: PagosTransaccionesRepository,
    private readonly usuarioUsuariosRepository: UsuarioUsuariosRepository,
  ) {}
  // Este método ahora devuelve un Buffer, no una ruta
  async generateReport(usuarioId: number, requestCobrosRealizadoDto: RequestCobrosRealizadoDto, ext: string): Promise<Buffer> {
    const data = await this.pagosTransaccionesRepository.findCobrosRealizados(usuarioId, requestCobrosRealizadoDto.fechaInicioPago, requestCobrosRealizadoDto.fechaFinPago);
    if (!data.length) throw new Error('No hay datos para el reporte');

    const filtroString = this.verificarAlgunCampoConValor(requestCobrosRealizadoDto) ? `<div><strong>Periodo: ${moment(requestCobrosRealizadoDto.fechaInicioPago).format('DD/MM/YYYY')} - ${moment(requestCobrosRealizadoDto.fechaFinPago).format('DD/MM/YYYY')}</strong></div>` : '';

    const dataEmpresa = await this.usuarioUsuariosRepository.findDatosPersonaAndEmpresa(usuarioId);
    const funcionesGenerales = new FuncionesGenerales();
    const base64Limpio = funcionesGenerales.limpiarBase64(dataEmpresa.logo_base64);
    const payload = {
      data,
      parameters: { P_filtros: filtroString, P_logo_empresa_base64: base64Limpio },
      templatePath: '/reports/cobros_realizados.jrxml',
      format: ext,
    };

    const response = await axios.post(process.env.REPORT_API+'/reports/generate', payload, {
      responseType: 'arraybuffer', // 👈 Importante para recibir binario
      headers: { 'Content-Type': 'application/json' },
    });

    return Buffer.from(response.data);
  }

  // Función para verificar si los campos no están vacíos
  verificarAlgunCampoConValor(obj) {
    for (const [key, value] of Object.entries(obj)) {
      // Verifica si el valor NO es null, undefined ni una cadena vacía
      if (value !== null && value !== undefined && value !== '') {
        return true; // Si encontramos un campo lleno, devolvemos true
      }
    }
    return false; // Si todos los campos están vacíos, devolvemos false
  }
}
