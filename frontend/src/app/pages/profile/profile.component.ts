import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators'; // Optional: Use 'first()' if you only need one value

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
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userService.getUserById(1).subscribe({
      next: (data) => {
        this.user = data;

        this.initializeForm(data);

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
