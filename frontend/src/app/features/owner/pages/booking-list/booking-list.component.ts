import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss'],
})
export class BookingListComponent {
  bookings: any[] = [];
  filteredBookings: any[] = [];

  filterStatus: string = '';
  searchText: string = '';

  selectedBooking: any = null;
  showModal = false;


  constructor(private http: HttpClient,private authService:AuthService,private bookingService:BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    const ownerId = Number(this.authService.getUserId());

    this.bookingService.getBookings(ownerId).subscribe({
      next: (data) => {
        this.bookings = data;
        this.filteredBookings = [...this.bookings];
        this.applyFilters();
      },
      error: (err) => console.error('Error loading bookings:', err),
    });
  }

  applyFilters(): void {
    const status = this.filterStatus.trim().toLowerCase();
    const search = this.searchText.trim().toLowerCase();

    this.filteredBookings = this.bookings.filter((b) => {
      const matchesStatus =
        !status || b.status?.toLowerCase() === status;

      const matchesSearch =
        !search ||
        b.vehicleModel?.toLowerCase().includes(search) ||
        b.ownerName?.toLowerCase().includes(search);

      return matchesStatus && matchesSearch;
    });
  }

  getVehicleImage(vehicle: any): string {
    return this.bookingService.getVehicleImage(vehicle);
  }

  viewBooking(b: any): void {
    this.selectedBooking = b;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedBooking = null;
  }

  acceptBooking(b: any): void {
    if (!confirm('Are you sure you want to accept this booking?')) return;

    this.bookingService.acceptBooking(b.id).subscribe({
      next: () => {
        alert('Booking accepted successfully.');
        this.loadBookings();
      }
    });
  }

  rejectBooking(b: any): void {
    if (!confirm('Are you sure you want to reject this booking?')) return;

    this.bookingService.rejectBooking(b.id).subscribe({
      next: () => {
        alert('Booking rejected successfully.');
        this.loadBookings();
      }
    });
  }

  markAvailable(b: any): void {
    this.bookingService.markVehicleAvailable(b.vehicleId).subscribe({
      next: () => {
        alert('Vehicle marked as AVAILABLE.');
        this.loadBookings();
      }
    });
    this.bookingService.makeBookingComplete(b.id).subscribe({
      next: () => {
        this.loadBookings();
      }
    });
  }

  markMaintenance(b: any): void {
    this.bookingService.markVehicleMaintenance(b.vehicleId).subscribe({
      next: () => {
        alert('Vehicle moved to MAINTENANCE.');
        this.loadBookings();
      }
    });
    this.bookingService.makeBookingComplete(b.id).subscribe({
      next: () => {
        this.loadBookings();
      }
    });
  }
}
