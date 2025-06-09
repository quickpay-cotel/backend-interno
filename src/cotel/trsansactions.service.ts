import { CotelTransacionesRepository } from './../common/repository/cotel.transacciones.repository';
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { IDatabase } from "pg-promise";


@Injectable()
export class TransactionService {

    constructor(
        private readonly cotelTransacionesRepository: CotelTransacionesRepository) {
    }

    async obtenerPagoMes() {
        try {
            return await this.cotelTransacionesRepository.pagosMes();
        } catch (error) {
            throw new HttpException(error.response.data.data, HttpStatus.NOT_FOUND);
        }
    }
    async obtenerPagoSemana() {
        try {
            return await this.cotelTransacionesRepository.pagosSemana();
        } catch (error) {
            throw new HttpException(error.response.data.data, HttpStatus.NOT_FOUND);
        }
    }
    async obtenerPagoPorEstado() {
        try {
            return await this.cotelTransacionesRepository.pagosPorEstado();
        } catch (error) {
            throw new HttpException(error.response.data.data, HttpStatus.NOT_FOUND);
        }
    }
    async obtenerUltimosPagos(pLimit: number) {
        try {
            return await this.cotelTransacionesRepository.pagosUltimos(pLimit);
        } catch (error) {
            throw new HttpException(error.response.data.data, HttpStatus.NOT_FOUND);
        }
    }
}

