import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';
import { BookingService } from 'src/app/core/services/booking.service';
import { VehicleService } from 'src/app/core/services/vehicle.service';

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
  isWaiting: boolean = false;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private bookingService: BookingService,
    private vehicleService: VehicleService,
  ) {}

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
    this.vehicleService.getVehicleById(id).subscribe({
      next: (vehicle) => {
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
      renterId: this.authService.getUserId(),
      vehicleId: this.vehicle.id,
      startTime: this.startTime,
      endTime: this.endTime,
      amount: this.totalAmount,
    };

    this.bookingService.createBooking(booking).subscribe({
      next: () => {
        alert('Booking request sent to owner for approval!');
        this.isConfirmed = true;
        this.isWaiting = true;
      },
      error: (err) => console.error('Booking failed:', err),
    });
  }

  onPayNow(): void {
    this.isPaid = true;
    alert('Payment successful! Booking confirmed');
  }

  getVehicleImage(vehicle: any): string {
    return this.vehicleService.getVehicleImage(vehicle);
  }
}
