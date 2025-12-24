import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OwnerComponent } from './owner.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { RoleGuard } from 'src/app/core/guards/role.guard';
import { OwnerDashboardComponent } from './pages/owner-dashboard/owner-dashboard.component';
import { BookingListComponent } from './pages/booking-list/booking-list.component';
import { VehicleRegistrationComponent } from './pages/vehicle-registration/vehicle-registration.component';
import { ProfileComponent } from 'src/app/pages/profile/profile.component';
import { MyVehiclesComponent } from './pages/my-vehicles/my-vehicles.component';
const routes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_OWNER'] },
    children: [
      { path: 'dashboard', component: OwnerDashboardComponent },
      { path: 'bookingList', component: BookingListComponent },
      { path: 'myVehicles', component: MyVehiclesComponent },
      { path: 'vehicles/register', component: VehicleRegistrationComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OwnerRoutingModule { }
