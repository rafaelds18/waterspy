import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SessionService } from "../services/session.service";

const TOKEN_HEADER = 'x-access-token';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private sessionService: SessionService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = req;
        const token = this.sessionService.getToken();

        if (token != null) {
            authReq = req.clone({headers: req.headers.set(TOKEN_HEADER, token)});
        }

        return next.handle(authReq);
    }
}

export const authInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];