import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss'],
})
export class BookingDetailsComponent implements OnInit {
  vehicle: any = null;
  totalAmount: number = 0;
  startTime!: Date;
  endTime!: Date;
  hoursDiff: number = 0;
  daysDiff: number = 0;
  isConfirmed: boolean = false;
  isPaid: boolean = false;
  loading = true;

  private apiUrl = 'http://localhost:8092/api/vehicles';
  private bookingApi = 'http://localhost:8092/api/bookings';
  private backendUrl='http://localhost:8092';
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const { vehicleId, startTime, endTime } = params;
      if (vehicleId && startTime && endTime) {
        this.startTime = new Date(startTime);
        this.endTime = new Date(endTime);
        this.loadVehicle(vehicleId);
      }
    });
  }

  loadVehicle(id: number): void {
    this.http.get(`${this.apiUrl}/${id}`).subscribe({
      next: (vehicle: any) => {
        this.vehicle = vehicle;
        this.calculateAmount();
        this.loading = false;
      },
      error: (err) => console.error('Error loading vehicle:', err),
    });
  }

  calculateAmount(): void {
    const diffMs = this.endTime.getTime() - this.startTime.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    this.daysDiff = Math.floor(diffHours / 24);
    this.hoursDiff = Math.ceil(diffHours % 24);

    this.totalAmount =
      this.daysDiff * this.vehicle.pricePerDay +
      this.hoursDiff * this.vehicle.pricePerHour;
  }

  onBookVehicle(): void {
    const booking = {
      renterId: 1,
      vehicleId: this.vehicle.id,
      startTime: this.startTime,
      endTime: this.endTime,
      amount: this.totalAmount,
    };

    this.http.post(this.bookingApi, booking).subscribe({
      next: (response) => {
        alert('Booking request sent to owner for approval!');
        this.isConfirmed = true;
      },
      error: (err) => console.error('Booking failed:', err),
    });
  }

  onPayNow(): void {
    this.isPaid = true;
    alert('Payment successful! Booking confirmed ');
  }
  getVehicleImage(v: any): string {
    if (!v.images || v.images.length === 0) {
      return 'assets/vehicle-placeholder.png';
    }

    const validImage = v.images.find((img: string) => img && img.trim() !== '');
    if (validImage) {
      if (validImage.startsWith('/uploads')) {
        return `${this.backendUrl}${validImage}`;
      }
      if (validImage.startsWith('image')) {
        return `${this.backendUrl}/${validImage}`;
      }
    }

    return 'assets/vehicle-placeholder.png';
  }
}
