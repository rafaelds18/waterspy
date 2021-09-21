import { Role } from './../../models/role';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class RoleService {
    private baseUrl = this.apiUrl + 'api/role';
    constructor(private http: HttpClient, @Inject('API_BASE_URL') protected apiUrl: string) {
    }

    public getAll() {
        return this.http.get<Array<Role>>(this.baseUrl);
    }
}