import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/user-header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { UserDashboardComponent } from './pages/user/user-dashboard/user-dashboard.component';
import { VehicleListComponent } from './pages/user/vehicle-list/vehicle-list.component';
import { VehicleRegistrationComponent } from './pages/owner/vehicle-registration/vehicle-registration.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminHeaderComponent } from './components/header/admin-header/admin-header.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminVehicleComponent } from './pages/admin/admin-vehicle/admin-vehicle.component';
import { AdminUsersListComponent } from './pages/admin/admin-users-list/admin-users-list.component';
import { BookingsComponent } from './pages/user/bookings/bookings.component';
import { BookingDetailsComponent } from './pages/user/booking-details/booking-details.component';
import { OwnerHeaderComponent } from './components/header/owner-header/owner-header.component';
import { MyBookingsComponent } from './pages/user/my-bookings/my-bookings.component';
import { BookingListComponent } from './pages/owner/booking-list/booking-list.component';
import { OwnerDashboardComponent } from './pages/owner/owner-dashboard/owner-dashboard.component';

import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './core/services/auth.service';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LandingComponent } from './components/landing/landing.component';
import { NgChartsModule } from 'ng2-charts';
import { AdminAnalyticsComponent } from './pages/admin/admin-analytics/admin-analytics.component';


export function tokenGetter() {
  return localStorage.getItem('jwtToken');
}

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
    OwnerHeaderComponent,
    MyBookingsComponent,
    BookingListComponent,
    OwnerDashboardComponent,
    LoginComponent,
    RegisterComponent,
    LandingComponent,
    AdminAnalyticsComponent
  ],
  imports: [
    NgChartsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    // JwtModule.forRoot({
    //   config: {
    //     tokenGetter: tokenGetter,
    //     allowedDomains: ['localhost:8092'],
    //   }
    // })
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
