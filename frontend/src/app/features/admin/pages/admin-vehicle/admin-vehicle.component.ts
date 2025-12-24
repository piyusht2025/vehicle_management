import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { VehicleService } from 'src/app/core/services/vehicle.service';

@Component({
  selector: 'app-admin-vehicle',
  templateUrl: './admin-vehicle.component.html',
  styleUrls: ['./admin-vehicle.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminVehicleComponent implements OnInit {
  constructor(private vehicleService: VehicleService) {}
  vehicles: any[] = [];
  filteredVehicles: any[] = [];
  filteredStatus: String = '';
  searchText: String = '';
  selectedVehicle: any = {};
  showModal: boolean = false;
  ngOnInit() {
    this.loadVehicle();
  }
  loadVehicle() {
    this.vehicleService.getAllVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.filteredVehicles = [...this.vehicles];
      },
    });
  }
  filterVehicle() {
    const search = this.searchText.trim().toLowerCase();
    const status = this.filteredStatus.trim().toLowerCase();


    this.filteredVehicles = this.vehicles.filter((vehicle) => {
       const matchesStatus =
        !status || vehicle.status?.toLowerCase() === status;

      const matchesSearch =
        !search ||
        vehicle.brand?.toLowerCase().includes(search) ||
        vehicle.model?.toLowerCase().includes(search);

      return matchesStatus && matchesSearch;

    });
  }
  approveVehicle(id: number) {

    this.vehicleService.accept(id).subscribe({
      next: (data) => {
        this.loadVehicle();
      },
    });
  }
  viewVehicle(vehicle: any) {
    this.selectedVehicle = vehicle;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedVehicle = {};
  }

  refreshVehicles() {
    this.loadVehicle();
  }

  deleteVehicle(id:number){
    this.vehicleService.delete(id).subscribe({
      next:(data)=>{
        this.loadVehicle();
      }
    });
  }
}
