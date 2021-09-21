import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Contract } from '../../models/contract';
import { Notification } from '../../models/notification';
import { User } from '../../models/user';


@Injectable({
    providedIn: 'root'
})

export class NotificationService {
    private baseUrl = this.apiUrl + 'api/notifications';
    constructor(private http: HttpClient, @Inject('API_BASE_URL') protected apiUrl: string) {
    }

    public getNotifications() {
        return this.http.get<Array<Notification>>(this.baseUrl);
    }

    public sendNotification(user: User, contract: Contract, subject: string, message: string) {
        return this.http.post<any>(this.baseUrl, { user, contract, subject, message });
    }

}