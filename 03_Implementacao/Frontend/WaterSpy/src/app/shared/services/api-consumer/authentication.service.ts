import { User } from 'src/app/shared/models/user';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {
    private baseUrl = this.apiUrl + 'api/auth';
    constructor(private http: HttpClient, @Inject('API_BASE_URL') protected apiUrl: string) {
    }

    public login(user: any) {
        return this.http.post<any>(this.baseUrl + '/login', user);
    }

    public register(user: User) {
        return this.http.post<User>(this.baseUrl + '/register', user);
    }

    public confirmEmail(token: string) {
        return this.http.post<User>(this.baseUrl + '/confirmEmail', { token });
    }
}