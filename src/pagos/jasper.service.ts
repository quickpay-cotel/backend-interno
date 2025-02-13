import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';
import { CotelDeudasRepository } from 'src/common/repository/cotel.deudas.repository';
import { ConsultaPagosDto } from './dto/consulta-pagos.dto';

@Injectable()
export class JasperService {

    constructor(private readonly cotelDeudasRepository: CotelDeudasRepository) {

    }

    async generateReport(consultaPagosDto: ConsultaPagosDto, ext:string ): Promise<string> {

        let data = await this.cotelDeudasRepository.findPagosRealizados(
            consultaPagosDto.nombreCompleto, consultaPagosDto.servicio, consultaPagosDto.idTransaccion,
             consultaPagosDto.periodo,consultaPagosDto.codigoDeuda, consultaPagosDto.mensajeDeuda,
              consultaPagosDto.mensajeContrato,consultaPagosDto.tipoDocumento, 
              consultaPagosDto.numeroDocumento, consultaPagosDto.fechaInicioPago, consultaPagosDto.fechaFinPago
        );
        const jasperStartetPath = path.join(process.cwd(), 'reportes/jasperstarter/bin/jasperstarter');
        const jsonFilePath = path.join(process.cwd(), 'jasper-templates/pagos_realizados/pagos_realizados.json');
        const jrxmlFilePath = path.join(process.cwd(), 'jasper-templates/pagos_realizados/pagos_realizados.jrxml');
        const outputFilePath = path.join(process.cwd(), 'reportes/reportes/pagos_realizados');

        await fs.writeFileSync(jsonFilePath, JSON.stringify(data));
        return new Promise((resolve, reject) => {
            
            //jasperstarter.exe pr -t json --json-query "." --data-file pagos_realizados.json -f pdf -o ReportOutput pagos_realizados.jrxml

            //const command = `${jasperStartetPath} pr -t json --json-query "." --data-file ${jsonFilePath} -f pdf -o ${outputFilePath} ${jrxmlFilePath}`

            const command = `${jasperStartetPath} pr -t json --json-query "." --data-file ${jsonFilePath} -f ${ext} -o ${outputFilePath} ${jrxmlFilePath}`

            console.log(command);
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error generando el reporte: ${error.message}`);
                    reject(error);
                    return;
                }
                console.log(`Reporte generado: ${stdout}`);
                resolve(outputFilePath+"."+ext);
            });
        });
    }
}
