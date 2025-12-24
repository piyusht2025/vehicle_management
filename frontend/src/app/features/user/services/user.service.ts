import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from 'src/environments/environment'
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = `${environment.apiBaseUrl}/users`;
  constructor(private http: HttpClient) {}


  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getUserById/${id}`);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/updateUserById/${id}`, data,{ responseType: 'text' });
  }

  getMonthlyEarnings(ownerId: number): Observable<any> {
    return this.http.get(
      `${environment.apiBaseUrl}/bookings/owner/${ownerId}/monthly-earnings`
    );
  }

  getUserName(id: Number):Observable<any> {
    return this.http.get(`${this.baseUrl}/getUserById/${id}`);
  }

  getDashboardData(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${userId}/dashboard-data`);
  }

}
