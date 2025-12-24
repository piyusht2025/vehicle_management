import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private http: HttpClient) {}

  private bookingApiUrl = `${environment.apiBaseUrl}/bookings`;

  createBooking(booking: any): Observable<any> {
    return this.http.post(this.bookingApiUrl, booking);
  }

  getBookingsByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.bookingApiUrl}/user/${userId}`);
  }

  cancelBooking(bookingId: number): Observable<any> {
    return this.http.patch(`${this.bookingApiUrl}/${bookingId}/cancel`, {});
  }

  payBooking(bookingId: number): Observable<any> {
    return this.http.patch(
      `${this.bookingApiUrl}/${bookingId}/pay`,
      {},
      { responseType: 'text' }
    );
  }

  rateVehicle(bookingId: number, rating: number): Observable<any> {
    return this.http.patch(
      `${this.bookingApiUrl}/${bookingId}/rate-vehicle`,
      { rating },
      { responseType: 'text' }
    );
  }

}
