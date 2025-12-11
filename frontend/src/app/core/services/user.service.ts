import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8092/api/users';
  constructor(private http: HttpClient) {}
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getUserById/${id}`);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }
  getMonthlyEarnings(ownerId: number): Observable<any> {
    return this.http.get(
      `http://localhost:8092/api/booking/owner/${ownerId}/monthly-earnings`
    );
  }
  getUserName(id: Number):Observable<any> {
    return this.http.get(`${this.baseUrl}/getUserById/${id}`);
  }
}
