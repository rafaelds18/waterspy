import { Meter } from './../../models/meter';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Contract } from '../../models/contract';

@Injectable({
    providedIn: 'root'
})

export class ContractService {
    private baseUrl = this.apiUrl + 'api/contract';
    constructor(private http: HttpClient, @Inject('API_BASE_URL') protected apiUrl: string) {
    }

    public add(email: string, contract: Contract, meters?: Array<Meter>) {
        return this.http.post<Contract>(this.baseUrl + '/add', { email, contract, meters});
    }

    public getAll() {
        return this.http.get<Array<Contract>>(this.baseUrl + '/all');
    }

    public getDetailsByUser() {
        return this.http.get<Array<Contract>>(this.baseUrl + '/detailsByUser');
    }

    public getDetails(contractNumber: number) {
        return this.http.get<Array<Contract>>(this.baseUrl + '/' + contractNumber);
    }
}