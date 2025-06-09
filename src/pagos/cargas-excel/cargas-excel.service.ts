import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { PagosCargasExcelRepository } from 'src/common/repository/pagos/pagos.cargas_excel.repository';
import { PagosDeudasRepository } from 'src/common/repository/pagos/pagos.deudas.repository';
import { IDatabase } from 'pg-promise';
import { DeudaExcelDto } from './dto/deuda-excel.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';


@Injectable()
export class CargasExcelService {
  constructor(
    private readonly pagosCargasExcelRepository: PagosCargasExcelRepository,
    private readonly pagosDeudasRepository: PagosDeudasRepository,
    @Inject("DB_CONNECTION") private db: IDatabase<any>,
  ) { }

  async procesarExcel(file: Express.Multer.File) {

    try {

      const workbook = XLSX.readFile(file.path);
      const sheetName = workbook.SheetNames[0];

      const rawRows = XLSX.utils.sheet_to_json<any>(workbook.Sheets[sheetName]);

      //const rows = plainToInstance(DeudaExcelDto, rawRows);

      const rows: DeudaExcelDto[] = rawRows.map((row) => ({
        codigoCliente: row['codigoCliente'] ? String(row['codigoCliente']) : null,
        nombreCompleto: row['nombreCompleto'] ? String(row['nombreCompleto']) : null,
        tipoDocumento: row['tipoDocumento'] ? String(row['tipoDocumento']) : null,
        numeroDocumento: row['numeroDocumento'] ? String(row['numeroDocumento']) : null,
        complemento_documento: row['complementoDocumento'] ? String(row['complementoDocumento']) : null,
        tipoPagoId: row['tipoPagoId'] ? Number(row['tipoPagoId']) : null,
        codigoServicio: row['codigoServicio'] ? String(row['codigoServicio']) : null,
        descripcionServicio: row['descripcionServicio'] ? String(row['descripcionServicio']) : null,
        periodo: row['periodo'] ? String(row['periodo']) : null,
        monto: row['monto'] !== undefined && row['monto'] !== '' ? Number(row['monto']) : null,
        monto_descuento: row['montoDescuento'] !== undefined && row['montoDescuento'] !== '' ? Number(row['montoDescuento']) : null,
        email: row['email'] ? String(row['email']) : null,
        telefono: row['telefono'] ? String(row['telefono']) : null,
      }));


      const errores: any[] = [];

      for (const [index, row] of rows.entries()) {
        const resultado = await validate(row);
        if (resultado.length > 0) {
          errores.push({ fila: index + 2, errores: resultado }); // +2 porque Excel empieza en 1 y la primera es header
        }
      }

      if (errores.length > 0) {
        const erroresTexto = errores.map(error => {
          const fila = error.fila;
          const mensajes = error.errores.map((e: any) => Object.values(e.constraints).join(', ')).join(' | ');
          return ` Fila ${fila}: ${mensajes}`;
        }).join('\n');
        throw new BadRequestException(`Errores de validación:\n${erroresTexto}`);
      }

      // 1. Guardar registro de carga
      let carga = await this.pagosCargasExcelRepository.create({
        usuario_id: 1, // segu auth
        archivo_nombre: file.originalname,
        ruta_archivo: file.path,
        estado_id: 1000,
      });

      for (const row of rows) {
        await this.pagosDeudasRepository.create({
          carga_id: carga.carga_id,
          codigo_cliente: row.codigoCliente,
          nombre_completo: row.nombreCompleto,
          tipo_documento: row.tipoDocumento,
          numero_documento: row.numeroDocumento,
          complemento_documento: row.complementoDocumento,
          tipo_pago_id: row.tipoPagoId,
          codigo_servicio: row.codigoServicio,
          descripcion_servicio: row.descripcionServicio,
          periodo: row.periodo,
          monto: row.monto,
          monto_descuento: row.montoDescuento,
          email: row.email,
          telefono: row.telefono,
          estado_id: 1000,
        });

      }
      return carga;

    } catch (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }
}
