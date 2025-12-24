import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private vehicleUrl = `${environment.apiBaseUrl}/vehicles`;
  private cityUrl = `${environment.apiBaseUrl}/city`;
  private backendUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  registerVehicle(vehicleData: any): Observable<any> {
    return this.http.post(this.vehicleUrl, vehicleData);
  }

  getAvailableVehicle(): Observable<any> {
    return this.http.get(`${this.vehicleUrl}/available`);
  }

  getAllVehicles(): Observable<any> {
    return this.http.get(this.vehicleUrl);
  }

  accept(id: number): Observable<any> {
    return this.http.patch(`${this.vehicleUrl}/${id}`, {
      status: 'AVAILABLE',
      active: true,
    });
  }

  reject(id: number): Observable<any> {
    return this.http.patch(`${this.vehicleUrl}/${id}`, {
      status: 'REJECTED',
    });
  }

  delete(id: number): Observable<any> {
    return this.http.patch(`${this.vehicleUrl}/${id}`, {
      status: 'NOT_AVAILABLE',
      active: false,
    });
  }

  uploadImage(vehicleId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.vehicleUrl}/${vehicleId}/images`, formData);
  }

  getAllCity(): Observable<any> {
    return this.http.get(this.cityUrl);
  }

   getVehicleById(id: number): Observable<any> {
    return this.http.get<any>(`${this.vehicleUrl}/${id}`);
  }

  getVehicleImage(vehicle: any): string {
    if (!vehicle?.images || vehicle.images.length === 0) {
      return 'assets/vehicle-placeholder.png';
    }

    const validImage = vehicle.images.find(
      (img: string) => img && img.trim() !== ''
    );

    if (!validImage) return 'assets/vehicle-placeholder.png';

    if (validImage.startsWith('/uploads')) {
      return `${this.backendUrl}${validImage}`;
    }

    return `${this.backendUrl}/${validImage}`;
  }




}
