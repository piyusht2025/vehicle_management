import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/features/user/services/user.service';
import { environment } from 'src/environments/environment';
import { AdminService } from '../../services/admin.service';

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
      y: {
        beginAtZero: true,
      },
    },
  };

  private apiUrl = `${environment.apiBaseUrl}`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService,
    private adminService: AdminService
  ) {}

  adminId = Number(this.authService.getUserId());
  adminName: String | null = null;

  ngOnInit(): void {
    this.loadAdminName();
    this.loadDashboard();
  }

  private loadAdminName(): void {
    this.userService.getUserName(this.adminId).subscribe({
      next: (res) => (this.adminName = res.name),
    });
  }

  private loadDashboard(): void {
    this.adminService
      .getTotalUsers()
      .subscribe((val) => (this.stats.totalUsers = val));

    this.adminService
      .getTotalOwners()
      .subscribe((val) => (this.stats.totalOwners = val));

    this.adminService
      .getTotalVehicles()
      .subscribe((val) => (this.stats.totalVehicles = val));

    this.adminService
      .getPendingVehicleApprovals()
      .subscribe((val) => (this.stats.pendingVehicleApprovals = val));

    this.adminService.getMonthlyEarnings().subscribe((res) => {
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
    });
  }
}
