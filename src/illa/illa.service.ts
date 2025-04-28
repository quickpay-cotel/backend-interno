import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class IllaService {
    private token: any;
    private readonly axiosInstance: AxiosInstance;
    constructor(){
    // Configuración de Axios
    this.axiosInstance = axios.create({
        baseURL: process.env.ILLA_API,
        timeout: 60000,
    });
}

    async generarToken(): Promise < any > {
    try {
        const response = await this.axiosInstance.post("api/v1/authentications/signin",
            {
                email: process.env.ILLA_EMAIL,
                password: process.env.ILLA_PASSWORD,
            }
        );
        if(response.data) {
    this.token = response.data;
} else {
    this.token = "";
}
        } catch (error) {
    throw error;
}
    }

    async notaConciliacion(body: any) {
    try {
        await this.generarToken();
        const response = await this.axiosInstance.post("api/v1/adjustments/queries", body, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        });
        return response.data.adjustments; // Devuelve el payload en caso de éxito
    } catch (error) {
        if (error.response) {

            throw new HttpException(error.response.data.message, HttpStatus.NOT_FOUND);
        } else {
            
            throw new HttpException("Error desconocido al generar Nota Conciliación", HttpStatus.NOT_FOUND);
        }
    }
}
}
