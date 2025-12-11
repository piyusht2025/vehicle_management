import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from './pages/user/user-dashboard/user-dashboard.component';
import { VehicleListComponent } from './pages/user/vehicle-list/vehicle-list.component';
import { VehicleRegistrationComponent } from './pages/owner/vehicle-registration/vehicle-registration.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminUsersListComponent } from './pages/admin/admin-users-list/admin-users-list.component';
import { AdminVehicleComponent } from './pages/admin/admin-vehicle/admin-vehicle.component';
import { BookingsComponent } from './pages/user/bookings/bookings.component';
import { BookingDetailsComponent } from './pages/user/booking-details/booking-details.component';
import { MyBookingsComponent } from './pages/user/my-bookings/my-bookings.component';
import { BookingListComponent } from './pages/owner/booking-list/booking-list.component';
import { OwnerDashboardComponent } from './pages/owner/owner-dashboard/owner-dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LandingComponent } from './components/landing/landing.component';
import { AdminAnalyticsComponent } from './pages/admin/admin-analytics/admin-analytics.component';

// const routes: Routes = [
//   {path:'',redirectTo:'user/dashboard',pathMatch:'full'},
//   {path:'user/dashboard',component:UserDashboardComponent},
//   {path:'user/vehicles',component:VehicleListComponent},
//   {path:'vehicles/register',component:VehicleRegistrationComponent},
//   {path:'profile',component:ProfileComponent},
//   {path:'admin/dashboard',component:AdminDashboardComponent},
//   {path:'admin/users',component:AdminUsersListComponent},
//   {path:'admin/vehicles',component:AdminVehicleComponent},
//   {path:'user/bookings',component:BookingsComponent},
//   {path:'user/bookingDetails',component:BookingDetailsComponent},
//   {path:'user/myBookings',component:MyBookingsComponent},
//   {path:'owner/bookingList',component:BookingListComponent},
//   {path:'owner/dashboard',component:OwnerDashboardComponent},

// ];
const routes: Routes = [
{ path: '', component: LandingComponent },
{ path: 'login', component: LoginComponent },
{ path: 'register', component: RegisterComponent },


  {
    path: 'user/dashboard',
    component: UserDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user/vehicles',
    component: VehicleListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user/bookings',
    component: BookingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user/bookingDetails',
    component: BookingDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user/myBookings',
    component: MyBookingsComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'vehicles/register',
    component: VehicleRegistrationComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_OWNER'] }
  },
  {
    path: 'owner/bookingList',
    component: BookingListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_OWNER', 'ROLE_ADMIN'] }
  },
  {
    path: 'owner/dashboard',
    component: OwnerDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_OWNER'] }
  },

  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'admin/users',
    component: AdminUsersListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'admin/vehicles',
    component: AdminVehicleComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'admin/analytics',
    component: AdminAnalyticsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
