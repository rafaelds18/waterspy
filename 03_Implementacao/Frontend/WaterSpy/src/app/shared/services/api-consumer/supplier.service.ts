import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Supplier } from '../../models/supplier';

@Injectable({
    providedIn: 'root'
})

export class SupplierService {
    private baseUrl = this.apiUrl + 'api/supplier';
    constructor(private http: HttpClient, @Inject('API_BASE_URL') protected apiUrl: string) {
    }

    public getAll() {
        return this.http.get<Supplier[]>(this.baseUrl + '/getAll');
    }

    public add(supplier: Supplier): Observable<any> {
        return this.http.post<any>(this.baseUrl + '/add', supplier);
    }

    public update(supplier: Supplier) {
        return this.http.put<Supplier>(this.baseUrl + '/update', { supplier });
    }
}