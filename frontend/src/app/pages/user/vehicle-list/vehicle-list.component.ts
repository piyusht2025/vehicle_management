
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

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
  isFiltered=false;
  private apiUrl = 'http://localhost:8092/api/vehicles/available';
  private backendUrl = 'http://localhost:8092';

  constructor(private http: HttpClient, private route: ActivatedRoute ,private router:Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (Object.keys(params).length>0){
        this.isFiltered=true;
      }
      else{
        this.isFiltered=false;
      }
      console.log("...",params);

      this.loadVehicles(params);
    });
  }


  loadVehicles(filters: any = {}): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (response) => {
        this.hideLoader();
        this.vehicles = response || [];
        this.applyFilters(filters);
      },
      error: (err) => {
        console.error('Error fetching vehicles:', err);
        this.hideLoader();
      }
    });
  }

  applyFilters(filters: any): void {
    const { city, type } = filters;
    console.log('Filters:', filters);

    this.filteredVehicles = this.vehicles.filter((v) => {
      const matchesCity = !city || v.city?.toLowerCase() === city.toLowerCase();
      const matchesType = !type || v.type?.toLowerCase() === type.toLowerCase();
      const matchesStatus = v.status?.toUpperCase() === 'AVAILABLE';
      return matchesCity && matchesType && matchesStatus;
    });

    console.log('Filtered vehicles:', this.filteredVehicles);
  }

  viewVehicle(vehicle: any): void {
    this.selectedVehicle = vehicle;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedVehicle = null;
  }

  getVehicleImage(v: any): string {
    if (!v.images || v.images.length === 0) {
      return 'assets/vehicle-placeholder.png';
    }

    const validImage = v.images.find((img: string) => img && img.trim() !== '');
    if (validImage) {
      if (validImage.startsWith('/uploads')) {
        return `${this.backendUrl}${validImage}`;
      }
      if (validImage.startsWith('image')) {
        return `${this.backendUrl}/${validImage}`;
      }
    }

    return 'assets/vehicle-placeholder.png';
  }

  private hideLoader(): void {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
  }
  onBooking(vehicle:any){
    const params={...this.route.snapshot.queryParams};
    params["vehicleId"]=vehicle.id;
    this.router.navigate(["user/bookingDetails"],{queryParams:params})
  }
}
