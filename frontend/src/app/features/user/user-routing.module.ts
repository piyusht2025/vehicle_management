import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { VehicleListComponent } from './pages/vehicle-list/vehicle-list.component';
import { BookingsComponent } from './pages/bookings/bookings.component';
import { BookingDetailsComponent } from './pages/booking-details/booking-details.component';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';
import { ProfileComponent } from 'src/app/pages/profile/profile.component';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { VehiclesResolver } from 'src/app/core/services/vehicles-resolver.service';
const routes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_USER'] },
    children: [
      { path: 'dashboard', component: UserDashboardComponent },
      {
        path: 'vehicles',
        component: VehicleListComponent,
        data: { reuseComponent: true },
        resolve: {
          vehicles: VehiclesResolver,
        },
      },
      { path: 'bookings', component: BookingsComponent },
      { path: 'bookingDetails', component: BookingDetailsComponent },
      { path: 'myBookings', component: MyBookingsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
