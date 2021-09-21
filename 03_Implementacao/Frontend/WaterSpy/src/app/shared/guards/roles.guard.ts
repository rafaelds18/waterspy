import { SessionService } from '../services/session.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class RolesGuard implements CanActivate {
    constructor(
        private router: Router,
        private sessionService: SessionService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const hasPermission = this.sessionService.hasPermission(route.data.roles);
        if (!hasPermission) {
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
            return false;
        }
        
        return hasPermission;
    }
}