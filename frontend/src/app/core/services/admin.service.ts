import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:8092/api/admin';
  getRevenue():Observable<any>{
    return this.http.get(`${this.apiUrl}/total-revenues`);
  }

  getTopSpenders():Observable<any>{
    return this.http.get(`${this.apiUrl}/top-spenders`);
  }
  getTopVehicles():Observable<any>{
    return this.http.get(`${this.apiUrl}/top-vehicles`);
  }
}
