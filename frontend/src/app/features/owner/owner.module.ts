import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OwnerRoutingModule } from './owner-routing.module';
import { OwnerComponent } from './owner.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { BookingListComponent } from './pages/booking-list/booking-list.component';
import { OwnerDashboardComponent } from './pages/owner-dashboard/owner-dashboard.component';
import { VehicleRegistrationComponent } from './pages/vehicle-registration/vehicle-registration.component';
import { OwnerHeaderComponent } from '../../shared/components/headers/owner-header/owner-header.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { MyVehiclesComponent } from './pages/my-vehicles/my-vehicles.component';


@NgModule({
  declarations: [
    OwnerComponent,
    BookingListComponent,
    OwnerDashboardComponent,
    VehicleRegistrationComponent,
    MyVehiclesComponent,
  ],
  imports: [
    CommonModule,
    OwnerRoutingModule,
    FormsModule,
    NgChartsModule,
    RouterModule,
    ReactiveFormsModule,
SharedModule]
})
export class OwnerModule { }
