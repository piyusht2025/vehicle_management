import { OwnerService } from './../../services/owner.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { VehicleService } from 'src/app/core/services/vehicle.service';
import { BookingService } from '../../services/booking.service';

interface Vehicle {
  id: string;
  model: string;
  type: string;
  pricePerHour: number;
  status: 'AVAILABLE' | 'NOT_AVAILABLE' | 'MAINTENANCE' | 'BOOKED';
  registrationNo: string;
  images: string[];
}

@Component({
  selector: 'app-my-vehicles',
  templateUrl: './my-vehicles.component.html',
  styleUrls: ['./my-vehicles.component.scss'],
})
export class MyVehiclesComponent implements OnInit {
  ownerId = Number(this.authService.getUserId());

  vehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];
  filterStatus: string = '';
  searchText: string = '';
  showModal: boolean = false;
  selectedVehicle: Vehicle | null = null;

  constructor(
    private router: Router,
    private ownerService: OwnerService,
    private authService: AuthService,
    private vehicleService: VehicleService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.ownerService.getMyVehicles(this.ownerId).subscribe((data) => {
      this.vehicles = data;
      this.filteredVehicles = data;
    });
  }

  applyFilters(): void {
    this.filteredVehicles = this.vehicles.filter((vehicle) => {
      const matchesStatus =
        !this.filterStatus || vehicle.status === this.filterStatus;
      const matchesSearch =
        !this.searchText ||
        vehicle.model.toLowerCase().includes(this.searchText.toLowerCase()) ||
        vehicle.type.toLowerCase().includes(this.searchText.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }

  viewVehicle(vehicle: Vehicle): void {
    this.selectedVehicle = vehicle;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedVehicle = null;
  }

  makeAvailable(vehicle: Vehicle): void {
    this.bookingService.markVehicleAvailable(Number(vehicle.id));
    vehicle.status = 'AVAILABLE';
    alert(`${vehicle.model} is now available for booking!`);
  }

  markMaintenance(vehicle: Vehicle): void {
    this.bookingService.markVehicleMaintenance(Number(vehicle.id));

    alert(`${vehicle.model} has been marked for maintenance.`);
  }

  addVehicle(): void {
    this.router.navigate(['/owner/vehicles/add']);
  }

  getVehicleImage(vehicle: any): string {
    return this.vehicleService.getVehicleImage(vehicle);
  }
}
