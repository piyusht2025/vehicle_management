import { AuthService } from 'src/app/core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserService } from '../../services/user.service';
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
  userName = '';
  stats = {
    activeBookings: 0,
    totalBookings: 0,
    totalSpent: 0,
    recentBookings: [],
  };
  recentBookings: any[] = [
    {
      id: Number,
      vehicleModel: String,
      ownerName: String,
      startTime: String,
      endTime: String,
      amount: Number,
      status: String,
      vehicleId: Number,
      vehicleStatus: String,
    },
  ];
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private userService: UserService,
  ) {}
  private userApiUrl = `${environment.apiBaseUrl}/users`;
  userId = Number(this.authService.getUserId());
  ngOnInit(): void {
    this.userService.getDashboardData(this.userId).subscribe({
      next: (data) => {
        this.stats = data;
        this.recentBookings = data.recentBookings;
      },
      error: (err) => console.error('Error loading dashboard:', err),
    });
    this.userService.getUserById(this.userId).subscribe({
      next:(data)=>{this.userName=data.name}
    })
  }

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
