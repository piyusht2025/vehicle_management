import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { VehicleListComponent } from './pages/vehicle-list/vehicle-list.component';
import { HttpClientModule } from '@angular/common/http';
import { VehicleRegistrationComponent } from './pages/vehicle-registration/vehicle-registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './pages/profile/profile.component';
import { CommonModule } from '@angular/common';
import { AdminHeaderComponent } from './components/header/admin-header/admin-header.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminVehicleComponent } from './pages/admin/admin-vehicle/admin-vehicle.component';
import { AdminUsersListComponent } from './pages/admin/admin-users-list/admin-users-list.component';
import { BookingsComponent } from './pages/bookings/bookings.component';
import { BookingDetailsComponent } from './pages/booking-details/booking-details.component';
import { OwnerHeaderComponent } from './components/header/owner-header/owner-header.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    UserDashboardComponent,
    VehicleListComponent,
    VehicleRegistrationComponent,
    ProfileComponent,
    AdminHeaderComponent,
    AdminDashboardComponent,
    AdminVehicleComponent,
    AdminUsersListComponent,
    BookingsComponent,
    BookingDetailsComponent,
    OwnerHeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
     CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
