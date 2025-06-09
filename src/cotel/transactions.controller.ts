import {
    Controller,
    Get,
} from "@nestjs/common";
import { TransactionService } from "./trsansactions.service";

@Controller("transaction")
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }
    @Get("pagos-mes")
    async envioobtenerPagoMesCorreo() {
        return await this.transactionService.obtenerPagoMes();
    }
    @Get("pagos-semana")
    async obtenerPagoSemana() {
        return await this.transactionService.obtenerPagoSemana();
    }
    @Get("pagos-estado")
    async obtenerPagoPorEstado() {
        return await this.transactionService.obtenerPagoPorEstado();
    }
    @Get("pagos-ultimo")
    async obtenerUltimosPagos() {
        return await this.transactionService.obtenerUltimosPagos(10);
    }
}
