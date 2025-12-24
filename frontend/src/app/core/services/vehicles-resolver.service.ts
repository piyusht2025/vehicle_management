import { Injectable } from '@angular/core';

import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { VehicleService } from './vehicle.service';

@Injectable({
  providedIn: 'root'
})
export class VehiclesResolver implements Resolve<any[]> {

  constructor(private vehicleService: VehicleService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]> {
    console.log("vehicles", this.vehicleService.getAvailableVehicle().subscribe());
    return this.vehicleService.getAvailableVehicle();
  }
}

