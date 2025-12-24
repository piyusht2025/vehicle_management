import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {
 private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getOwnerDetails(ownerId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/getUserById/${ownerId}`);
  }

  getOwnerVehicles(ownerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vehicles/owner/${ownerId}`);
  }

  getOwnerBookings(ownerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bookings/owner/${ownerId}`);
  }

  getRevenuePerVehicle(ownerId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/bookings/owner/${ownerId}/revenue`
    );
  }

  acceptBooking(bookingId: number): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/bookings/${bookingId}/accept`,
      {}
    );
  }

  rejectBooking(bookingId: number): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/bookings/${bookingId}/reject`,
      {}
    );
  }

  getMyVehicles(bookingId:number):Observable<any>{
    return this.http.get(`${this.apiUrl}/vehicles/owner/${bookingId}`);
  }
}
