import { UserService } from '../../core/services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators'; // Optional: Use 'first()' if you only need one value
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  successMessage = '';
  user: any = {};

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private authService:AuthService
  ) {}

  role=this.authService.getUserRoles();
  userId=this.authService.getUserId();
  ngOnInit(): void {
    this.userService.getUserById(this.userId!).subscribe({
      next: (data) => {
        this.user = data;

        this.initializeForm(data);
        console.log(this.role);
        
        console.log(this.user);
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
      }
    });
  }

  initializeForm(data: any): void {
    this.profileForm = this.fb.group({
      name: [data.name || '', Validators.required],
      email: [{ value: data.email || '', disabled: true }],
      phone: [data.phone || ''],
      licenseNo: [data.licenseNo || ''],
    });
  }

  updateProfile(): void {
  }
}
