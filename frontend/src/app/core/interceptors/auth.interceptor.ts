import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshSubject = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    const expireBy = this.authService.getExpire();

    if (this.isAuthUrl(req.url)) {
      return next.handle(req);
    }

    let authReq = req;

    const REFRESH_MARGIN_MS = 5000;

    if(this.authService.isLoggedIn() && Date.now()>(this.authService.getRefreshToeknExpire()*1000)){
      this.forceLogout();
    }

    if (expireBy && Date.now() + REFRESH_MARGIN_MS >= (expireBy*1000)) {
      return this.performRefreshAndReplay(req, next);
    }

    if (token) {
      this.authService.getExpire();
      authReq = this.addTokenHeader(req, token);
    }

    return next.handle(authReq).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );

  }

  private performRefreshAndReplay(req: HttpRequest<any>,next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      const refreshToken = this.authService.getRefreshToken();

      if (!refreshToken) {
        this.forceLogout();
        return throwError(() => new Error('No refresh token'));
      }

      this.isRefreshing = true;
      this.refreshSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((newTokens: any) => {
          this.isRefreshing = false;
          this.refreshSubject.next(newTokens.access_token);
          const cloned = this.addTokenHeader(req, newTokens.accessToken);
          return next.handle(cloned);
        }),
        catchError((e) => {
          this.isRefreshing = false;
          this.forceLogout();
          return throwError(() => e);
        })
      );
    } else {
      return this.refreshSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((token) => {
          const cloned = this.addTokenHeader(req, token.accessToken);
          return next.handle(cloned);
        })
      );
    }
  }

  private forceLogout() {
    this.authService.logout();
  }

  private addTokenHeader(req: HttpRequest<any>, token: string) {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private isAuthUrl(url: string): boolean {
    return (
      url.includes('/api/auth/login') ||
      url.includes('/api/auth/register') ||
      url.includes('/api/auth/refresh')
    );
  }
}
