import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private http: HttpClient) {}

  bookingApi = `${environment.apiBaseUrl}/bookings`;
  private vehicleApi = `${environment.apiBaseUrl}/vehicles`;
  private backendUrl = environment.baseUrl;

  getBookings(ownerId: Number): Observable<any[]> {
    return this.http.get<any[]>(`${this.bookingApi}/owner/${ownerId}`);
  }

  acceptBooking(bookingId: number): Observable<any> {
    return this.http.patch(
      `${this.bookingApi}/${bookingId}/accept`,
      {},
      { responseType: 'text' }
    );
  }

  rejectBooking(bookingId: number): Observable<any> {
    return this.http.patch(
      `${this.bookingApi}/${bookingId}/reject`,
      {},
      { responseType: 'text' }
    );
  }

  markVehicleAvailable(vehicleId: number): Observable<any> {
    return this.http.patch(`${this.vehicleApi}/${vehicleId}/mark-available`,
      {},
      { responseType: 'text' }
    );
  }

  markVehicleMaintenance(vehicleId: number): Observable<any> {
    return this.http.patch(
      `${this.vehicleApi}/${vehicleId}/mark-maintenance`,
      {},
      { responseType: 'text' }
    );
  }

  makeBookingComplete(bookingId:number):Observable<any>{
    return this.http.patch(`${this.bookingApi}/${bookingId}/mark-complete`,
      {},
      {responseType:'text'}
    )
  }
  getVehicleImage(vehicle: any): string {
    if (!vehicle?.images || vehicle.images.length === 0) {
      return 'assets/vehicle-placeholder.png';
    }

    const validImg = vehicle.images.find(
      (img: string) => img && img.trim() !== ''
    );

    if (!validImg) return 'assets/vehicle-placeholder.png';

    if (validImg.startsWith('/uploads')) {
      return `${this.backendUrl}${validImg}`;
    }

    return `${this.backendUrl}/${validImg}`;
  }
}
