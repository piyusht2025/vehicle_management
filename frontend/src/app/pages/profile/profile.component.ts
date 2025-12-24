import { UserService } from '../../features/user/services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  user: any = {};
  isEditMode = false;
  isLoading = false;
  originalUserData: any = {};

  role = this.authService.getUserRoles();
  userId = this.authService.getUserId();

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.userService.getUserById(this.userId!).subscribe({
      next: (data) => {
        this.user = data;
        this.originalUserData = { ...data };
        this.initializeForm(data);
        console.log('Role:', this.role);
        console.log('User:', this.user);
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
        this.errorMessage = 'Failed to load user data';
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

  toggleEditMode(): void {
    this.isEditMode = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.initializeForm(this.originalUserData);
    this.successMessage = '';
    this.errorMessage = '';
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const updatedData = {
      name: this.profileForm.get('name')?.value,
      email: this.user.email,
      phone: this.profileForm.get('phone')?.value,
      licenseNo: this.profileForm.get('licenseNo')?.value
    };

    this.userService.updateUser(this.userId!, updatedData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Profile updated successfully!';

        this.user = { ...this.user, ...updatedData };
        this.originalUserData = { ...this.user };

        setTimeout(() => {
          this.isEditMode = false;
          this.successMessage = '';
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error updating profile:', err);
        this.errorMessage = err.error?.message || 'Failed to update profile. Please try again.';
      }
    });
  }
}
