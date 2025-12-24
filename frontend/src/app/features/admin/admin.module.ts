import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminUsersListComponent } from './pages/admin-users-list/admin-users-list.component';
import { AdminVehicleComponent } from './pages/admin-vehicle/admin-vehicle.component';
import { AdminAnalyticsComponent } from './pages/admin-analytics/admin-analytics.component';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminHeaderComponent } from 'src/app/shared/components/headers/admin-header/admin-header.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminUsersListComponent,
    AdminVehicleComponent,
    AdminAnalyticsComponent,
AdminHeaderComponent ,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
     NgChartsModule,
     SharedModule,
     RouterModule
  ],

})
export class AdminModule {}
