import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }
  private baseUrl = `${environment.apiBaseUrl}/admin`;
  getRevenue():Observable<any>{
    return this.http.get(`${this.baseUrl}/total-revenues`);
  }

  getTopSpenders():Observable<any>{
    return this.http.get(`${this.baseUrl}/top-spenders`);
  }
  getTopVehicles():Observable<any>{
    return this.http.get(`${this.baseUrl}/top-vehicles`);
  }

  getTotalUsers(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/total-users`);
  }

  getTotalOwners(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/total-owners`);
  }

  getTotalVehicles(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/total-vehicles`);
  }

  getPendingVehicleApprovals(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/pending-vehicle-approvals`);
  }

  getMonthlyEarnings(): Observable<{
    months: string[];
    earnings: number[];
  }> {
    return this.http.get<{
      months: string[];
      earnings: number[];
    }>(`${this.baseUrl}/monthly-earnings`);
  }
}
