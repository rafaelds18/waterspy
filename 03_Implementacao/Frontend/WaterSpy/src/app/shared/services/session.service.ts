import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class SessionService {
    private projectName = 'waterspy';
    constructor() {
    }

    public storeSession(data: any) {
        if (data) {
            this.storageUpdate('accesstoken', data.accessToken);
            this.storageUpdate('email', data.email);

            if (data.roles) {
                let roles = [];
                for (const role of data.roles) {
                    roles.push(role.description);
                }
                this.storageUpdate('roles', JSON.stringify(roles));
            }
        }
    }

    public isAuthenticated(): boolean {
        return this.storageGet('accesstoken') != null;
    }

    public isAdmin(): boolean {
        return this.getRoles().indexOf('Admin') != -1;
    }

    public getRoles(): Array<any> {
        const roles = this.storageGet('roles');
        if (roles) {
            return JSON.parse(roles);
        }
        return new Array<any>();
    }

    public getToken() {
        return this.storageGet('accesstoken');
    }

    public getEmail() {
        return this.storageGet('email');
    }

    public hasPermission(roles: Array<any>) {
        if (!roles || roles.length == 0) {
            return false;
        }

        const userRoles: Array<any> = this.getRoles();
        if (userRoles) {
            for (const userRole of userRoles) {
                for (const role of roles) {
                    if (userRole == role) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public clearSession() {
        this.storageReset();
    }

    private storageGet(key: string): string {
        return localStorage[this.projectName + "_" +  key];
    } 

    private storageUpdate(key: string, object: any) {
        localStorage[this.projectName + "_" + key] = object;
    } 

    private storageReset() {
        for (const key in localStorage) {
            if (key.startsWith(this.projectName) && localStorage.hasOwnProperty(key)) {
                localStorage.removeItem(key);
            }
        }
    }

}