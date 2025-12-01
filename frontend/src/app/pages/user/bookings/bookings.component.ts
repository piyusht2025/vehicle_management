import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
})
export class BookingsComponent {
  searchForm!: FormGroup;
  cities = ['Gandhinagar', 'Ahmedabad', 'surat'];
  vehicleTypes = ['TWO WHEELER', 'FOUR WHEELER'];
  startTime!: Date;
  endTime!: Date;
  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.searchForm = this.fb.group({
      city: ['', Validators.required],
      type: [''],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });
  }

  onSearch() {
    if (this.searchForm.valid) {
      const params = this.searchForm.value;
      const { vehicleId, startTime, endTime } = params;
      this.startTime = new Date(this.startTime);
      this.endTime = new Date(this.endTime);
      if (endTime < startTime) {
        this.router.navigate(['user/bookings']);
        alert('End time cannot be before start time ');
      }
      else {
        setTimeout(() => {
          this.router.navigate(['user/vehicles'], { queryParams: params });
        }, 0);
        this.router.navigate(['user/vehicles'], { queryParams: params });
      }
    }
  }
}
