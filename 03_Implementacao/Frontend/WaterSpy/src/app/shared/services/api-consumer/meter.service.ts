import { Observable } from 'rxjs';
import { Meter } from './../../models/meter';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class MeterService {
    private baseUrl = this.apiUrl + 'api/meter';
    constructor(private http: HttpClient, @Inject('API_BASE_URL') protected apiUrl: string) {
    }

    public add(contractNumber: number, supplierId: number, meters?: Array<Meter>) {
        return this.http.post<any>(this.baseUrl + '/add', { contractNumber, supplierId, meters});
    }

    public getAll() {
        return this.http.get<Array<Meter>>(this.baseUrl);
    }

    public getByContract(contractId: number): Observable<Array<Meter>> {
        return this.http.get<Array<Meter>>(this.baseUrl + '/' + contractId);
    }
}