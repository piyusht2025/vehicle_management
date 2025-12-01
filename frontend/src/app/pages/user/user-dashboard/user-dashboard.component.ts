import { AuthService } from 'src/app/core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, NgModule } from '@angular/core';
interface Vehicle {
  id: number;
  name: string;
  type: string;
  image: string;
  price: number;
  rating: number;
  available: boolean;
}
interface Booking {
  id: number;
  vehicle: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'completed';
  amount: number;
}
@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
})
export class UserDashboardComponent implements OnInit {
  userName = 'Piyush';
  stats = {
    activeBookings: Number,
    totalBookings: Number,
    totalSpent: Number,
    recentBookings: [],
  };
  recentBookings :any[]=[ {
    id: Number,
    vehicleModel: String,
    ownerName: String,
    startTime: String,
    endTime: String,
    amount: Number,
    status: String,
    vehicleId: Number,
    vehicleStatus: String,
  }];
  constructor(private authService:AuthService,private http: HttpClient) {}
  private apiUrl = 'http://localhost:8092/api/users';
  userId = this.authService.getUserId();
  ngOnInit(): void {
    this.http
      .get<any>(`${this.apiUrl}/${this.userId}/dashboard-data`)
      .subscribe({
        next: (data) => {
          this.stats = data;
          this.recentBookings = data.recentBookings;
        },
        error: (err) => console.error('Error loading bookings:', err),
      });
  }
  featuredVehicles: Vehicle[] = [
    {
      id: 1,
      name: 'Tesla Model 3',
      type: 'Electric Sedan',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400',
      price: 120,
      rating: 4.8,
      available: true,
    },
    {
      id: 2,
      name: 'BMW X5',
      type: 'Luxury SUV',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
      price: 150,
      rating: 4.9,
      available: true,
    },
    {
      id: 3,
      name: 'Mercedes C-Class',
      type: 'Premium Sedan',
      image:
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400',
      price: 135,
      rating: 4.7,
      available: false,
    },
    {
      id: 4,
      name: 'Toyota Camry',
      type: 'Comfort Sedan',
      image:
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
      price: 80,
      rating: 4.6,
      available: true,
    },
  ];

  getStatusClass(status: string): string {
    return `status-${status}`;
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
