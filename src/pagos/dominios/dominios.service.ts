import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PagosDeudasRepository } from 'src/common/repository/pagos/pagos.deudas.repository';
import { FuncionesFechas } from '../../common/utils/funciones.fechas';
import { PagosDominiosRepository } from 'src/common/repository/pagos/pagos.dominios.repository';

@Injectable()
export class DominioService {
  constructor(
    private readonly pagosDominiosRepository: PagosDominiosRepository,
  ) {}
  async findByDominio(pDominio: string) {
    try {
      let resDominio = await this.pagosDominiosRepository.findByDominio(pDominio);
      return resDominio.map((obj) => ({
        dominioId: obj.dominio_id,
        dominio: obj.dominio,
        descripcion: obj.descripcion,
        abreviatura: obj.abreviatura
      }));
    } catch (error) {
      console.error('Erro al obtener el dominio:');
    }
  }
}
