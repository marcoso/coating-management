import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivateChild
} from '@angular/router';

import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean|UrlTree {
    if (this.authService.currentUserValue && this.authService.isAuthenticated()) {
      // check if route is restricted by role
      const userRole = this.authService.getUserRole();
      if (route.data.roles && route.data.roles.indexOf(userRole) === -1) {
        // role not authorised so redirect to not found page
        this.router.navigate(['/page404']);
        return false;
      }

      return true;
    }
    this.router.navigate(['/authentication/signin']);
    return false;
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean|UrlTree {
    return this.canActivate(route, state);
  }
}
