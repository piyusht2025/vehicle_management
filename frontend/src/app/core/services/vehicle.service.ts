import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

private baseUrl = 'http://localhost:8092/api/vehicles';
private cityUrl='http://localhost:8092/api/city';

  constructor(private http: HttpClient) {}
  registerVehicle(vehicleData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, vehicleData);
  }
  getAvailableVehicle(): Observable<any> {
    return this.http.get(`$this.baseUrl)/available`);
  }
  getAllVehicles(): Observable<any> {
    return this.http.get(this.baseUrl);
  }
  accept(id:number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`,{status:"AVAILABLE",active:true});
  }
  reject(id:number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`,{status:"REJECTED"});
  }
  delete(id:number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`,{status:"NOT_AVAILABLE",active:false});
  }

  uploadImage(vehicleId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/${vehicleId}/images`, formData);
  }

  getAllCity():Observable<any>{
    return this.http.get(this.cityUrl);
  }
}

