import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';
import { BookingService } from 'src/app/core/services/booking.service';
import { VehicleService } from 'src/app/core/services/vehicle.service';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MyBookingsComponent implements OnInit {
  bookings: any[] = [];
  filteredBookings: any[] = [];

  filterStatus: string = '';
  searchText: string = '';

  selectedBooking: any = null;
  showModal = false;

  showRatingModal = false;
  rateTargetBooking: any = null;
  ratingSelected = 5;


  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private vehicleservice: VehicleService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    const userId = Number(this.authService.getUserId());

    this.bookingService.getBookingsByUser(userId).subscribe({
      next: (data) => {
        this.bookings = data;
        this.filteredBookings = [...data];
        this.applyFilters();
      },
      error: (err) => console.error('Error loading bookings:', err),
    });
  }

  applyFilters(): void {
    const status = this.filterStatus.trim().toLowerCase();
    const search = this.searchText.trim().toLowerCase();

    this.filteredBookings = this.bookings.filter((b) => {
      const matchesStatus = !status || b.status?.toLowerCase() === status;

      const matchesSearch =
        !search ||
        b.vehicleModel?.toLowerCase().includes(search) ||
        b.ownerName?.toLowerCase().includes(search);

      return matchesStatus && matchesSearch;
    });
  }

  getVehicleImage(vehicle: any): string {
    return this.vehicleservice.getVehicleImage(vehicle);
  }

  viewBooking(b: any): void {
    this.selectedBooking = b;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedBooking = null;
  }

  openRatingModal(b: any): void {
    this.rateTargetBooking = b;
    this.ratingSelected = 5;
    this.showRatingModal = true;
  }

  selectRating(value: number): void {
    this.ratingSelected = value;
  }

  closeRatingModal(): void {
    this.showRatingModal = false;
    this.rateTargetBooking = null;
    this.ratingSelected = 5;
  }

  submitRating(): void {
    if (!this.rateTargetBooking?.id) return;

    this.bookingService
      .rateVehicle(this.rateTargetBooking.id, this.ratingSelected)
      .subscribe({
        next: () => {
          alert('Thanks for rating!');
          this.closeRatingModal();
          this.loadBookings();
        },
        error: (err) => {
          console.error('Rating failed', err);
          alert('Failed to submit rating.');
        },
      });
  }

  cancelBooking(b: any): void {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    this.bookingService.cancelBooking(b.id).subscribe({
      next: () => {
        alert('Booking canceled successfully.');
        this.loadBookings();
      },
    });
  }

  payBooking(b: any): void {
    this.bookingService.payBooking(b.id).subscribe({
      next: () => {
        alert('Payment successful!');
        this.loadBookings();
      },
    });
  }
}
