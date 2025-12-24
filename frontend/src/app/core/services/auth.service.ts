import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
interface AuthRequest {
  email: string;
  password: string;
}
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/auth`;
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private cookieService: CookieService , private router:Router) {}

  login(credentials: AuthRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          this.setTokens(response.accessToken, response.refreshToken);
        })
      );
  }
  register(userData: any): Observable<any> {
    console.log(userData);

    return this.http.post(`${this.apiUrl}/register`, userData);
  }
  setTokens(accessToken: string, refreshToken: string) {
    this.cookieService.set(this.accessTokenKey, accessToken, {
      path: '/',
      sameSite: 'Strict',
    });
    this.cookieService.set(this.refreshTokenKey, refreshToken, {
      path: '/',
      sameSite: 'Strict',
    });
  }

  logout() {
    console.log('Logout');
    this.cookieService.delete(this.accessTokenKey, '/');
    this.cookieService.delete(this.refreshTokenKey, '/');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.cookieService.get(this.accessTokenKey) || null;
  }

  getRefreshToken(): string | null {
    return this.cookieService.get(this.refreshTokenKey) || null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return true;
  }

  getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];

    const decoded = this.jwtHelper.decodeToken(token);
    return decoded?.roles || [];
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = this.jwtHelper.decodeToken(token);
      return decoded?.id || null;
    } catch (err) {
      console.error('JWT decode error', err);
      return null;
    }
  }

  getExpire(){
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = this.jwtHelper.decodeToken(token);
      return decoded?.exp || null;
    } catch (err) {
      console.error('JWT decode error', err);
      return null;
    }
  }

  getRefreshToeknExpire(){
    const token = this.getRefreshToken();
    if (!token) return null;

    try {
      const decoded = this.jwtHelper.decodeToken(token);
      return decoded?.exp || null;
    } catch (err) {
      console.error('JWT decode error', err);
      return null;
    }
  }



  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<AuthResponse>(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(
        tap((res) => {
          console.log("refresh token auth service respone:", res)
          this.setTokens(res.accessToken, res.refreshToken);
        })
      );
  }
}
