import { Component, OnInit,NgModule } from '@angular/core';
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
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  userName = 'Piyush';
  stats = {
    activeBookings: 2,
    totalBookings: 15,
    totalSpent: 4850
  };
  featuredVehicles: Vehicle[] = [
    {
      id: 1,
      name: 'Tesla Model 3',
      type: 'Electric Sedan',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400',
      price: 120,
      rating: 4.8,
      available: true
    },
    {
      id: 2,
      name: 'BMW X5',
      type: 'Luxury SUV',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
      price: 150,
      rating: 4.9,
      available: true
    },
    {
      id: 3,
      name: 'Mercedes C-Class',
      type: 'Premium Sedan',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400',
      price: 135,
      rating: 4.7,
      available: false
    },
    {
      id: 4,
      name: 'Toyota Camry',
      type: 'Comfort Sedan',
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
      price: 80,
      rating: 4.6,
      available: true
    }
  ];
  recentBookings: Booking[] = [
    {
      id: 1,
      vehicle: 'Tesla Model 3',
      startDate: '2025-11-05',
      endDate: '2025-11-08',
      status: 'upcoming',
      amount: 360
    },
    {
      id: 2,
      vehicle: 'BMW X5',
      startDate: '2025-10-28',
      endDate: '2025-11-02',
      status: 'active',
      amount: 750
    },
    {
      id: 3,
      vehicle: 'Mercedes C-Class',
      startDate: '2025-10-15',
      endDate: '2025-10-18',
      status: 'completed',
      amount: 405
    }
  ];
  ngOnInit(): void {
  }
  getStatusClass(status: string): string {
    return `status-${status}`;
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}







