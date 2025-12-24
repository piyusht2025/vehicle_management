import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
  CanLoad,
  UrlSegment,
  Route
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate, CanActivateChild,CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  private checkRole(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data?.['roles'] as string[] || [];
    const userRoles = this.authService.getUserRoles() || [];

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    if (expectedRoles.length === 0) return true;

    const hasRole = expectedRoles.some(role => userRoles.includes(role));
    if (!hasRole) {
      this.router.navigate(['/forbidden']);
      return false;
    }
    return true;
  }

  canActivate(route: ActivatedRouteSnapshot, state?: RouterStateSnapshot):
    boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.checkRole(route);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.checkRole(childRoute);
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
      return true;
    }
}
