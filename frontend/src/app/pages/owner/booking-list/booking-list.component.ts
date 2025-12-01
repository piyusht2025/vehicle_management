import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

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

  private bookingApi = 'http://localhost:8092/api/booking';
  private backendUrl = 'http://localhost:8092';

  constructor(private http: HttpClient,private authService:AuthService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    const ownerId = this.authService.getUserId();

    this.http.get<any[]>(`${this.bookingApi}/owner/${ownerId}`).subscribe({
      next: (data) => {
        this.bookings = data;
        this.filteredBookings = [...this.bookings];
        this.applyFilters();
        console.log(this.filteredBookings);
      },
      error: (err) => console.error('Error loading bookings:', err),
    });
  }

  applyFilters(): void {
    const status = this.filterStatus.trim().toLowerCase();
    const search = this.searchText.trim().toLowerCase();

    this.filteredBookings = this.bookings.filter((b) => {
      const matchesStatus = !status || b.status.toLowerCase() === status;

      const matchesSearch =
        !search ||
        b.vehicleModel?.toLowerCase().includes(search) ||
        b.ownerName?.toLowerCase().includes(search);

      return matchesStatus && matchesSearch;
    });
  }

  getVehicleImage(vehicle: any): string {
    if (!vehicle?.images || vehicle.images.length === 0) {
      return 'assets/vehicle-placeholder.png';
    }

    const validImg = vehicle.images.find(
      (img: string) => img && img.trim() !== ''
    );

    if (!validImg) return 'assets/vehicle-placeholder.png';

    if (validImg.startsWith('/uploads')) return `${this.backendUrl}${validImg}`;

    return `${this.backendUrl}/${validImg}`;
  }

  viewBooking(b: any): void {
    console.log('Hello');

    this.selectedBooking = b;
    console.log(this.selectedBooking);

    this.showModal = true;
    console.log(this.showModal);
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedBooking = null;
  }

  rejectBooking(b: any): void {
    if (!confirm('Are you sure you want to Reject this booking?')) return;

    this.http.patch(`${this.bookingApi}/${b.id}/reject`, {},{responseType:'text'}).subscribe({
      next: () => {
        alert('Booking rejected successfully.');
        this.loadBookings();
      },
      error: (err) => console.error('Rejection failed:', err),
    });
  }
  acceptBooking(b: any): void {
    if (!confirm('Are you sure you want to accept this booking?')) return;

    this.http.patch(`${this.bookingApi}/${b.id}/accept`, {},{responseType: 'text'}).subscribe({
      next: () => {
        alert('Booking accept successfully.');
        this.loadBookings();
      },
      error: (err) => console.error('accept failed:', err),
    });
  }
  markAvailable(b: any): void {
    this.http
      .patch(
        `http://localhost:8092/api/vehicles/${b.vehicleId}/mark-available`,
        {},{responseType: 'text'}
      )
      .subscribe({
        next: () => {
          alert('Vehicle marked as AVAILABLE.');
          this.loadBookings(); // refresh list
        },
        error: (err) => console.error('Error updating vehicle:', err),
      });
  }

  markMaintenance(b: any): void {
    this.http
      .patch(
        `http://localhost:8092/api/vehicles/${b.vehicleId}/mark-maintenance`,
        {},{responseType: 'text'}
      )
      .subscribe({
        next: () => {
          alert('Vehicle moved to MAINTENANCE.');
          this.loadBookings(); // refresh list
        },
        error: (err) => console.error('Error updating vehicle:', err),
      });
  }
}
