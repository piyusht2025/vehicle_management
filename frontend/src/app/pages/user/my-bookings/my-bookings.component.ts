import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class MyBookingsComponent implements OnInit {

  bookings: any[] = [];
  filteredBookings: any[] = [];

  filterStatus: string = "";
  searchText: string = "";

  selectedBooking: any = null;
  showModal = false;

  showRatingModal = false;
  rateTargetBooking: any = null;
  ratingSelected = 5;

  private bookingApi = 'http://localhost:8092/api/booking';
  private backendUrl = 'http://localhost:8092';

  constructor(private http: HttpClient,private authService:AuthService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    const userId = this.authService.getUserId();

    this.http.get<any[]>(`${this.bookingApi}/user/${userId}`).subscribe({
      next: (data) => {
        this.bookings = data;
        this.filteredBookings = [...this.bookings];
        this.applyFilters();
        console.log(this.filteredBookings);
      },
      error: (err) => console.error("Error loading bookings:", err),
    });
  }

  applyFilters(): void {
    const status = this.filterStatus.trim().toLowerCase();
    const search = this.searchText.trim().toLowerCase();

    this.filteredBookings = this.bookings.filter((b) => {
      const matchesStatus =
        !status || b.status.toLowerCase() === status;

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

    const validImg = vehicle.images.find((img: string) => img && img.trim() !== "");

    if (!validImg) return 'assets/vehicle-placeholder.png';

    if (validImg.startsWith('/uploads')) return `${this.backendUrl}${validImg}`;

    return `${this.backendUrl}/${validImg}`;
  }


  viewBooking(b: any): void {
    console.log("Hello");

    this.selectedBooking = b;
    console.log(this.selectedBooking);

    this.showModal = true;
    console.log(this.showModal );

  }


  openRatingModal(b: any): void {
    // ensure this booking belongs to current user (this page is user bookings so typically yes)
    this.rateTargetBooking = b;
    this.ratingSelected = 5; // default or you can set to 0
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
    if (!this.rateTargetBooking || !this.rateTargetBooking.id) return;

    const bookingId = this.rateTargetBooking.id;
    const payload = { rating: this.ratingSelected };

    // call backend PATCH /api/booking/{id}/rate-vehicle
    this.http.patch(`${this.bookingApi}/${bookingId}/rate-vehicle`, payload, { responseType: 'text' })
      .subscribe({
        next: () => {
          alert('Thanks for rating!');
          this.closeRatingModal();
          this.loadBookings(); // reload bookings to show updated rating
        },
        error: (err) => {
          console.error('Rating failed', err);
          alert('Failed to submit rating. Please try again.');
        }
      });
  }


  closeModal(): void {
    this.showModal = false;
    this.selectedBooking = null;
  }


  cancelBooking(b: any): void {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    this.http.patch(`${this.bookingApi}/${b.id}/cancel`, {}).subscribe({
      next: () => {
        alert("Booking canceled successfully.");
        this.loadBookings();
      },
      error: (err) => console.error("Cancel failed:", err),
    });
  }

  payBooking(b: any): void {
    this.http.patch(`${this.bookingApi}/${b.id}/pay`, {},{ responseType: 'text' }).subscribe({
      next: () => {
        alert("Payment successful!");
        this.loadBookings();
      },
      error: (err) => console.error("Payment failed:", err),
    });
  }
}
