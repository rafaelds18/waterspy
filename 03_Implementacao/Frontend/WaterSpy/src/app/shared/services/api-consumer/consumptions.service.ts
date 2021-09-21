import { Consumption } from './../../models/consumption';
import { User } from 'src/app/shared/models/user';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ConsultConsumptions } from '../../models/consult-consumptions';

@Injectable({
    providedIn: 'root'
})

export class ConsumptionService {
    private baseUrl = this.apiUrl + 'api/consumption';
    constructor(private http: HttpClient, @Inject('API_BASE_URL') protected apiUrl: string) {
    }

    public read(body: any) {
        return this.http.post<any>(this.baseUrl + '/read', body);
    }

    public send(consumption: Consumption) {
        return this.http.post<any>(this.baseUrl + '/send', consumption);
    }

    public getByMeter(meterId: number) {
        return this.http.get<Array<Consumption>>(this.baseUrl + '/' + meterId);
    }

    /**
     * GET SUM VALUES FROM EACH MONTH
     */
    public getAllSumConsumptions(contractNumber?: number, meterNumber?: number) {
        return this.http.get<Array<Consumption>>(this.baseUrl + '/allSumConsumptions/' + contractNumber + "/" + meterNumber);
    }

    public getWeekSumConsumptions(contractNumber?: number, meterNumber?: number) {
        return this.http.get<any>(this.baseUrl + '/weekAvgConsumptions/' + contractNumber + "/" + meterNumber);
    }

    public getAllWeekConsumptions(contractNumber?: number, meterNumber?: number) {
        return this.http.get<any>(this.baseUrl + '/allWeekConsumptions/' + contractNumber + "/" + meterNumber);
    }

    public getConsumptionsByMonth(month: number, contractNumber?: number, meterNumber?: number) {
        return this.http.get<any>(this.baseUrl + '/consumptionsByMonth/' + month + "/" + contractNumber + "/" + meterNumber);
    }

    /**
     * GET ALL VALUES FROM EACH MONTH
     */
    public getAllConsumptions(userId?: number) {
        return this.http.get<Array<Consumption>>(this.baseUrl + '/allConsumptions/' + userId);
    }

    public getAllConsumptionsByContract(contractNumber?: number, meterNumber?: number) {
        return this.http.get<Array<ConsultConsumptions>>(this.baseUrl + '/allConsumptionsByContract/' + contractNumber + "/" + meterNumber);
    }
}