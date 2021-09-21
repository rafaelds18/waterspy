import { SessionService } from '../services/session.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private sessionService: SessionService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.sessionService.isAuthenticated()) {
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
            return false;
        }
        
        return true;
    }
}