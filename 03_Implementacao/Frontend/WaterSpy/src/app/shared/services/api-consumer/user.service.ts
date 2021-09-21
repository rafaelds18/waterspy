import { User } from 'src/app/shared/models/user';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private baseUrl = this.apiUrl + 'api/user';
    constructor(private http: HttpClient, @Inject('API_BASE_URL') protected apiUrl: string) {
    }

    getAll() {
        return this.http.get<Array<User>>(this.baseUrl);
    }

    getAllWithDetails() {
        return this.http.get<Array<User>>(this.baseUrl + '/details');
    }

    getById(id: number) {
        return this.http.get<User>(this.baseUrl + '/' + id);
    }

    getByUsername(username: string) {
        return this.http.get<User>(this.baseUrl + '/email/' + username);
    }

    add(user: User) {
        return this.http.post<User>(this.baseUrl + '/add/user', user);
    }

    update(user: User) {
        return this.http.put<any>(this.baseUrl, { user });
    }
}