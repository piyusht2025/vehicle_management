import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
interface AuthRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8092/api/auth';
  private tokenKey = 'authToken';
  private jwtHelper = new JwtHelperService();
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(credentials: AuthRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          this.cookieService.set(this.tokenKey, response.token, {
            path: '/',
            secure: true,
            sameSite: 'Strict',
          });
        })
      );
  }

  register(userData: any): Observable<any> {
    console.log(userData);

    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout() {
    console.log("Logout");

    this.cookieService.delete(this.tokenKey, '/');
  }

  getToken(): string | null {
    return this.cookieService.get(this.tokenKey) || null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
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
      console.error("JWT decode error", err);
      return null;
    }
  }
  getUserName():string | null {
    const token=this.getToken();
    if (!token)return null;
    try{
      const decoded=this.jwtHelper.decodeToken(token);
      return decoded?.name || null;
    }
    catch(err){
      console.error("Jwt decode error",err);
      return null;
    }
  }
}
