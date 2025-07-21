import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as fs from 'fs-extra';
import * as path from 'path';
import { CotelDeudasRepository } from 'src/common/repository/cotel.deudas.repository';
import { ConsultaPagosDto } from './dto/consulta-pagos.dto';
import * as moment from 'moment';
@Injectable()
export class JasperService {

    constructor(private readonly cotelDeudasRepository: CotelDeudasRepository) {

    }

    async generateReport(consultaPagosDto: ConsultaPagosDto, ext: string): Promise<string> {

        let data = await this.cotelDeudasRepository.findPagosRealizados(
            consultaPagosDto.nombreCompleto, consultaPagosDto.servicio, consultaPagosDto.idTransaccion,
            consultaPagosDto.periodo, consultaPagosDto.codigoDeuda, consultaPagosDto.mensajeDeuda,
            consultaPagosDto.mensajeContrato, consultaPagosDto.tipoDocumento,
            consultaPagosDto.numeroDocumento, consultaPagosDto.fechaInicioPago, consultaPagosDto.fechaFinPago
        );


        if (!data.length) return;
        let filtroString ='';
        if (this.verificarAlgunCampoConValor(consultaPagosDto)) {
            let fechaIni = moment(consultaPagosDto.fechaInicioPago, 'YYYY-MM-DD').format('DD/MM/YYYY');
            let fechaFin = moment(consultaPagosDto.fechaFinPago, 'YYYY-MM-DD').format('DD/MM/YYYY');
            filtroString = `<div><strong>Periodo: ${fechaIni} - ${fechaFin}</strong>`;
        }

        console.log(filtroString);
        //let parametro = `-PP_filtros=${filtroString}` 
        let parametro = `-PP_filtros="${filtroString.replace(/"/g, '\\"')}"`;

        const jasperStartetPath = path.join(process.cwd(), 'reportes/jasperstarter/bin/jasperstarter');

        // Guardar el directorio de trabajo original
        const rutaInicial = process.cwd();
        
        // Cambiar al directorio donde están los archivos .jrxml e imágenes
        const workingDirectory = path.join(process.cwd(), 'jasper-templates/pagos_realizados');
        await process.chdir(workingDirectory);
        
        // Definir las rutas de los archivos
        const jsonFilePath = path.join(process.cwd(), 'pagos_realizados.json');
        const jrxmlFilePath = path.join(process.cwd(), 'pagos_realizados.jrxml');
        const outputFilePath = path.join(process.cwd(), 'pagos_realizados');
        
        // Escribir el archivo JSON
        await fs.writeFileSync(jsonFilePath, JSON.stringify(data));
        
        // Ejecutar el comando para generar el reporte
        return new Promise((resolve, reject) => {
            const command = `${jasperStartetPath} pr -t json --json-query "." --data-file ${jsonFilePath} -f ${ext} -o ${outputFilePath} ${jrxmlFilePath} ${parametro}`;
            console.log(command);
            
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error generando el reporte: ${error.message}`);
                    reject(error);
                    return;
                }
                console.log(`Reporte generado: ${stdout}`);
                
                // Volver al directorio inicial antes de generar el segundo reporte
                process.chdir(rutaInicial);
                resolve(outputFilePath + "." + ext);
            });
        });
        
    }
    // Función para verificar si los campos no están vacíos
    verificarAlgunCampoConValor(obj) {
        for (const [key, value] of Object.entries(obj)) {
            // Verifica si el valor NO es null, undefined ni una cadena vacía
            if (value !== null && value !== undefined && value !== "") {
                return true;  // Si encontramos un campo lleno, devolvemos true
            }
        }
        return false;  // Si todos los campos están vacíos, devolvemos false
    }
}
