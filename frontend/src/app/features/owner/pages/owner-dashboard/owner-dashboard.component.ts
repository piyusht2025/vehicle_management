import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/features/user/services/user.service';
import { OwnerService } from '../../services/owner.service';

@Component({
  selector: 'app-owner-dashboard',
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.scss'],
})
export class OwnerDashboardComponent implements OnInit {

  ownerId = Number(this.authService.getUserId());
  ownerName = 'Loading...';

  stats = {
    totalVehicles: 0,
    pendingApproval: 0,
    activeBookings: 0,
    totalRevenue: 0,
  };

  revenueChartType: 'pie' = 'pie';
  revenueChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [{ data: [] }],
  };

  monthlyChartType: 'bar' = 'bar';
  monthlyChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ label: 'Monthly Earnings (₹)', data: [] }],
  };

  monthlyChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: { y: { beginAtZero: true } },
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private ownerService: OwnerService

  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {

    this.ownerService.getOwnerDetails(this.ownerId).subscribe({
      next: (data) => this.ownerName = data.name
    });

    this.ownerService.getOwnerVehicles(this.ownerId).subscribe(res => {
      this.stats.totalVehicles = res.length;
    });

    this.ownerService.getOwnerBookings(this.ownerId).subscribe(res => {
      this.stats.activeBookings =
        res.filter(b => b.status === 'CONFIRMED').length;
      this.stats.pendingApproval =
        res.filter(b => b.status === 'UNCONFIRMED').length;
    });

    this.ownerService.getRevenuePerVehicle(this.ownerId).subscribe({
      next: (res) => this.buildRevenuePerVehicleChart(res),
      error: err => console.error('Revenue load failed', err)
    });

    this.userService.getMonthlyEarnings(this.ownerId).subscribe(data => {
      this.monthlyChartData = {
        labels: data.months,
        datasets: [{
          label: 'Monthly Earnings (₹)',
          data: data.earnings
        }]
      };
    });
  }

  private buildRevenuePerVehicleChart(revenueData: any[]): void {
    const labels: string[] = [];
    const data: number[] = [];

    revenueData.forEach(item => {
      labels.push(item.vehicleName);
      data.push(Number(item.revenue));
    });

    this.revenueChartData = {
      labels,
      datasets: [{ data }]
    };

    this.stats.totalRevenue = data.reduce((sum, v) => sum + v, 0);
  }

  accept(b: any): void {
    this.ownerService.acceptBooking(b.id).subscribe(() => {
      alert('Booking accepted!');
      this.loadDashboard();
    });
  }

  reject(b: any): void {
    this.ownerService.rejectBooking(b.id).subscribe(() => {
      alert('Booking rejected!');
      this.loadDashboard();
    });
  }
}
