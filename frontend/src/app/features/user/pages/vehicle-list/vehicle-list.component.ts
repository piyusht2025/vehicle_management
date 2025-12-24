import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { VehicleService } from 'src/app/core/services/vehicle.service';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss'],
})
export class VehicleListComponent implements OnInit {
  vehicles: any[] = [];
  filteredVehicles: any[] = [];
  selectedVehicle: any | null = null;
  showModal = false;
  isFiltered = false;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {

      this.isFiltered = Object.keys(params).length > 0;

      this.vehicles = this.route.snapshot.data['vehicles'] || [];

      this.hideLoader();
      this.applyFilters(params);
    });
  }

  applyFilters(filters: any): void {
    const { city, type } = filters;

    this.filteredVehicles = this.vehicles.filter(v => {
      const matchesCity =
        !city || v.city?.toLowerCase() === city.toLowerCase();

      const matchesType =
        !type || v.type?.toLowerCase() === type.toLowerCase();

      const matchesStatus =
        v.status?.toUpperCase() === 'AVAILABLE';

      return matchesCity && matchesType && matchesStatus;
    });
  }

  viewVehicle(vehicle: any): void {
    this.selectedVehicle = vehicle;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedVehicle = null;
  }

  getVehicleImage(vehicle: any): string {
    return this.vehicleService.getVehicleImage(vehicle);
  }

  onBooking(vehicle: any): void {
    const params = { ...this.route.snapshot.queryParams };
    params['vehicleId'] = vehicle.id;

    this.router.navigate(['user/bookingDetails'], {
      queryParams: params
    });
  }

  private hideLoader(): void {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
  }
}
