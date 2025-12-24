import { Component, OnInit } from '@angular/core';
import {
  ChartConfiguration,
  ChartOptions,
} from 'chart.js';
import { AdminService } from 'src/app/features/admin/services/admin.service';

interface TopSpender {
  userId: number;
  name: string;
  email: string;
  totalSpent: number;
  totalBooking: number;
}

interface TopVehicle {
  vehicleId: number;
  name: string;
  ownerName: string;
  totalRevenue: number;
  totalBooking: number;
}

interface OwnerStat {
  ownerId: number;
  ownerName: string;
  totalVehicles: number;
  totalBooking: number;
  totalRevenue: number;
}

@Component({
  selector: 'app-admin-analytics',
  templateUrl: './admin-analytics.component.html',
  styleUrls: ['./admin-analytics.component.scss'],
})
export class AdminAnalyticsComponent implements OnInit {
  kpi = {
    totalRevenue: 0,
    totalVehicles: 0,
  };

  topSpenders: TopSpender[] = [];
  topVehicles: TopVehicle[] = [];

  ownerStats: OwnerStat[] = [];

  ownerRevenueChartType: 'bar' = 'bar';

  ownerRevenueChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [],
      },
    ],
  };

  ownerRevenueChartOptions: ChartOptions<'bar'> = {
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

  constructor(private adminService:AdminService) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.adminService.getRevenue().subscribe({
      next:(data)=>{
        this.kpi.totalVehicles=data.totalVehicles;
        this.kpi.totalRevenue=data.totalRevenue;
      }
    });

    this.adminService.getTopSpenders().subscribe({
      next:(data)=>{
        this.topSpenders=data;
      }
    })
    this.adminService.getTopVehicles().subscribe({
      next:(data)=>{
        this.topVehicles=data;
      }
    })
    this.buildOwnerRevenueChart();
  }

  private buildOwnerRevenueChart(): void {
    const labels = this.ownerStats.map((o) => o.ownerName);
    const data = this.ownerStats.map((o) => o.totalRevenue);

    this.ownerRevenueChartData = {
      labels,
      datasets: [
        {
          label: 'Revenue (₹)',
          data,
        },
      ],
    };
  }
}
