import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './pages/profile/profile.component';
import { RoleGuard } from './core/guards/role.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LandingComponent } from './components/landing/landing.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user', loadChildren: () => import('./features/user/user.module').then(m => m.UserModule),
  canLoad: [AuthGuard,RoleGuard]
},
{ path: 'owner', loadChildren: () => import('./features/owner/owner.module').then(m => m.OwnerModule),
  canLoad: [AuthGuard,RoleGuard]
},
{ path: 'admin', loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
  canLoad: [AuthGuard,RoleGuard]
},


  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard,RoleGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
