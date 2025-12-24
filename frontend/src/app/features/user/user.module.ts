import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/headers/user-header/header.component';
import { VehicleListComponent } from './pages/vehicle-list/vehicle-list.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';
import { BookingDetailsComponent } from './pages/booking-details/booking-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BookingsComponent } from './pages/bookings/bookings.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    UserComponent,
    VehicleListComponent,
    UserDashboardComponent,
    MyBookingsComponent,
    BookingDetailsComponent,
    BookingsComponent,
    BookingsComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports:[
  ]
})
export class UserModule { }
