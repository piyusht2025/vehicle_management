import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { VehicleService } from 'src/app/services/vehicle.service';

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
    if (this.filteredStatus===""){
       this.filteredVehicles=this.vehicles;
       return;
    }
    this.filteredVehicles = this.vehicles.filter((vehicle) => {
      return vehicle.status === this.filteredStatus;
    });
  }
  approveVehicle(id: number) {
    console.log(id);

    this.vehicleService.accept(id).subscribe({
      next: (data) => {
        this.loadVehicle();
      },
    });
  }
  viewVehicle(vehicle: any) {
    console.log('Modal Opened for Vehicle:', vehicle);
    this.selectedVehicle = vehicle;
    this.showModal = true;
    console.log(this.showModal)
  }

  closeModal() {
    this.showModal = false;
    this.selectedVehicle = {};
  }

  refreshVehicles() {
    this.loadVehicle();
  }
}
