import { Component, OnInit } from '@angular/core';
import {
  ChartConfiguration,
  ChartOptions,
} from 'chart.js';
import { AdminService } from 'src/app/core/services/admin.service';

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

  // Row 3 data
  ownerStats: OwnerStat[] = [];

  // Owner-wise revenue bar chart
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


    // // Row 2 - Top Vehicles
    // this.topVehicles = [
    //   {
    //     vehicleId: 10,
    //     vehicleName: 'Tata Punch',
    //     ownerName: 'Piyush',
    //     totalRevenue: 92000,
    //     totalBookings: 14,
    //   },
    //   {
    //     vehicleId: 11,
    //     vehicleName: 'Hero Splendor',
    //     ownerName: 'Aman',
    //     totalRevenue: 55000,
    //     totalBookings: 20,
    //   },
    //   {
    //     vehicleId: 12,
    //     vehicleName: 'Hyundai i20',
    //     ownerName: 'Ravi',
    //     totalRevenue: 47000,
    //     totalBookings: 9,
    //   },
    // ];

    // Row 3 - Owner stats
    this.ownerStats = [
      {
        ownerId: 1,
        ownerName: 'Piyush',
        totalVehicles: 3,
        totalBooking: 18,
        totalRevenue: 120000,
      },
      {
        ownerId: 2,
        ownerName: 'Ankit',
        totalVehicles: 2,
        totalBooking: 10,
        totalRevenue: 65000,
      },
      {
        ownerId: 3,
        ownerName: 'Sneha',
        totalVehicles: 1,
        totalBooking: 7,
        totalRevenue: 42000,
      },
    ];

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
