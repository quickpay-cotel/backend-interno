import { Module } from "@nestjs/common";
import { UsuarioUsuariosRepository } from "./usuario/usuario.usuarios.repository";
import { CotelApiLogRepository } from "./cotel.api.log.repository";
import { CotelDeudasRepository } from "./cotel.deudas.repository";
import { CotelTransacionesRepository } from "./cotel.transacciones.repository";
import { PagosCargasExcelRepository } from "./pagos/pagos.cargas_excel.repository";
import { PagosDeudasRepository } from "./pagos/pagos.deudas.repository";
import { UsuarioEmpresaConfiguracionRepository } from "./usuario/usuario.empresa_configuracion.repository";
import { PagosDominiosRepository } from "./pagos/pagos.dominios.repository";
import { PagosTransaccionDeudaRepository } from "./pagos/pagos.transaccion_deuda.repository";
import { PagosTransaccionesRepository } from "./pagos/pagos.transacciones.repository";
import { PagosComprobanteFacturaRepository } from "./pagos/pagos.comprobante_factura.repository";
import { PagosComprobanteReciboRepository } from "./pagos/pagos.comprobante_recibo.repository";

@Module({
  imports: [], // Importa el ConfigModule para manejar las variables de entorno
  providers: [ UsuarioUsuariosRepository,CotelApiLogRepository,CotelDeudasRepository, 
    CotelTransacionesRepository, PagosCargasExcelRepository, PagosDeudasRepository,
    UsuarioEmpresaConfiguracionRepository,PagosDominiosRepository,PagosTransaccionDeudaRepository,
    PagosTransaccionesRepository,PagosComprobanteFacturaRepository,PagosComprobanteReciboRepository],
  exports: [ UsuarioUsuariosRepository,CotelApiLogRepository,CotelDeudasRepository,
    CotelTransacionesRepository,PagosCargasExcelRepository,PagosDeudasRepository,
    UsuarioEmpresaConfiguracionRepository,PagosDominiosRepository,PagosTransaccionDeudaRepository,
    PagosTransaccionesRepository,PagosComprobanteFacturaRepository,PagosComprobanteReciboRepository]
})
export class RepositoryModule { }
