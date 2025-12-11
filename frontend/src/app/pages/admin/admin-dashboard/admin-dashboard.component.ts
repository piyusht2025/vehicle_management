import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  stats = {
    totalUsers: 0,
    totalOwners: 0,
    totalVehicles: 0,
    pendingVehicleApprovals: 0,
  };

  // Bookings per month chart (BAR)
  bookingsChartType: 'bar' = 'bar';

  bookingsChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Bookings per Month',
        data: [],
      },
    ],
  };

  bookingsChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      x: {},
      y: {
        beginAtZero: true,
      },
    },
  };

  private apiUrl = 'http://localhost:8092/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService
  ) {}

  adminId = Number(this.authService.getUserId());
  adminName: String | null = null;
  ngOnInit(): void {
    this.userService.getUserName(this.adminId).subscribe({
      next: (res) => {
        this.adminName = res.name;
      },
    });
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.http.get<number>(`${this.apiUrl}/admin/total-users`).subscribe({
      next: (val) => {

        this.stats.totalUsers = val;
      },
      error: () => {

        this.stats.totalUsers = 0;
      },
    });

    this.http.get<number>(`${this.apiUrl}/admin/total-owners`).subscribe({
      next: (val) => (this.stats.totalOwners = val),
    });

    this.http.get<number>(`${this.apiUrl}/admin/total-vehicles`).subscribe({
      next: (val) => (this.stats.totalVehicles = val),
    });

    this.http
      .get<number>(`${this.apiUrl}/admin/pending-vehicle-approvals`)
      .subscribe({
        next: (val) => (this.stats.pendingVehicleApprovals = val),
      });

    this.http
      .get<{ months: string[]; earnings: number[] }>(
        `${this.apiUrl}/admin/monthly-earnings`
      )
      .subscribe({
        next: (res) => {
          this.bookingsChartData = {
            labels: res.months,
            datasets: [
              {
                label: 'Bookings per Month',
                data: res.earnings,
                backgroundColor: 'rgba(37, 99, 235, 0.6)',
                borderRadius: 6,
              },
            ],
          };
        },
        error: () => {
          console.log('Failed to load Data');
        },
      });
  }
}
