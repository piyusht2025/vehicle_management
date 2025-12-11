import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/auth.service';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-owner-dashboard',
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.scss'],
})
export class OwnerDashboardComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService
  ) {}
  ownerName = 'Loading...';
  ownerId = Number(this.authService.getUserId());
  stats = {
    totalVehicles: 0,
    pendingApproval: 0,
    activeBookings: 0,
    totalRevenue: 0,
  };

  pendingVehicles: any[] = [];
  recentBookings: any[] = [];

  private apiUrl = 'http://localhost:8092/api';
  revenueChartType: 'pie' = 'pie';
  revenueChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [{ data: [] }],
  };

  monthlyChartType: 'bar' = 'bar';
  monthlyChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Monthly Earnings (₹)',
        data: [],
      },
    ],
  };

  monthlyChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {},
      y: {
        beginAtZero: true,
      },
    },
  };

  ngOnInit() {
    this.loadDashboard();
    console.log(this.ownerId);

  }

  loadDashboard() {
    this.loadMonthlyEarnings();

    this.http
      .get<any>(`${this.apiUrl}/users/getUserById/${this.ownerId}`)
      .subscribe({
        next:(data)=>{
          console.log("Debug",data);

            this.ownerName=data.name;
        }
  })
    this.http
      .get<any>(`${this.apiUrl}/vehicles/owner/${this.ownerId}`)
      .subscribe((res) => {
        this.stats.totalVehicles  = res.length;
      });

    this.http
      .get<any>(`${this.apiUrl}/booking/owner/${this.ownerId}/revenue`)
      .subscribe({
        next: (res) => {
          this.buildRevenuePerVehicleChart(res);
        },
        error: (err) => {
          console.error('Error loading revenue per vehicle', err);
        },
      });
    this.http
      .get<any[]>(`${this.apiUrl}/booking/owner/${this.ownerId}`)
      .subscribe((res) => {
        this.stats.activeBookings = res.filter(
          (b) => b.status === 'CONFIRMED'
        ).length;
      });
  }

  private buildRevenuePerVehicleChart(revenueData: any[]): void {
    const labels: string[] = [];
    const data: number[] = [];
    console.log(revenueData);

    revenueData.forEach((item) => {
      labels.push(item.vehicleName);
      data.push(parseFloat(item.revenue));
    });

    this.revenueChartData = {
      labels,
      datasets: [
        {
          data,
        },
      ],
    };

    this.stats.totalRevenue = data.reduce((sum, x) => sum + x, 0);
  }

  loadMonthlyEarnings() {
    this.userService.getMonthlyEarnings(this.ownerId).subscribe((data) => {
      console.log(data, 'saldjadlajd');

      this.monthlyChartData = {
        labels: data.months,
        datasets: [
          {
            label: 'Monthly Earnings (₹)',
            data: data.earnings,
          },
        ],
      };
    });
  }

  accept(b: any) {
    this.http
      .patch(`${this.apiUrl}/booking/${b.id}/accept`, {})
      .subscribe(() => {
        alert('Booking accepted!');
        this.loadDashboard();
      });
  }

  reject(b: any) {
    this.http
      .patch(`${this.apiUrl}/booking/${b.id}/reject`, {})
      .subscribe(() => {
        alert('Booking rejected!');
        this.loadDashboard();
      });
  }
}
