import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnerHeaderComponent } from './components/headers/owner-header/owner-header.component';
import { HeaderComponent } from './components/headers/user-header/header.component';
import { FormGroup, FormsModule } from '@angular/forms';
import { AdminHeaderComponent } from './components/headers/admin-header/admin-header.component';
import { Router, RouterModule } from '@angular/router';

@NgModule({
  declarations: [OwnerHeaderComponent, HeaderComponent],
  imports: [CommonModule,
RouterModule
  ],
   exports: [
    FormsModule,
    HeaderComponent,
    OwnerHeaderComponent,
  ]
})
export class SharedModule {}
