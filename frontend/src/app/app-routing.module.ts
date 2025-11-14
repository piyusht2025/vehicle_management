import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { VehicleListComponent } from './pages/vehicle-list/vehicle-list.component';
import { VehicleRegistrationComponent } from './pages/vehicle-registration/vehicle-registration.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminUsersListComponent } from './pages/admin/admin-users-list/admin-users-list.component';
import { AdminVehicleComponent } from './pages/admin/admin-vehicle/admin-vehicle.component';
import { BookingsComponent } from './pages/bookings/bookings.component';
import { BookingDetailsComponent } from './pages/booking-details/booking-details.component';

const routes: Routes = [
  {path:'',redirectTo:'user/dashboard',pathMatch:'full'},
  {path:'user/dashboard',component:UserDashboardComponent},
  {path:'user/vehicles',component:VehicleListComponent},
  {path:'vehicles/register',component:VehicleRegistrationComponent},
  {path:'profile',component:ProfileComponent},
  {path:'admin/dashboard',component:AdminDashboardComponent},
  {path:'admin/users',component:AdminUsersListComponent},
  {path:'admin/vehicles',component:AdminVehicleComponent},
  {path:'user/bookings',component:BookingsComponent},
  {path:'user/bookingDetails',component:BookingDetailsComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
