import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { VehicleService } from '../../services/vehicle.service';
@Component({
  selector: 'app-vehicle-registration',
  templateUrl: './vehicle-registration.component.html',
  styleUrls: ['./vehicle-registration.component.scss']
})
export class VehicleRegistrationComponent {
  vehicleForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
   selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  constructor(private fb: FormBuilder, private vehicleService: VehicleService) {}
  ngOnInit(): void {
    this.vehicleForm = this.fb.group({
      ownerId: ['', Validators.required],
      type: ['', Validators.required],
      fuelType: ['', Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      registrationNo: ['', Validators.required],
      transmission: ['', Validators.required],
      city: ['', Validators.required],
      seat: ['', [Validators.required, Validators.min(1)]],
      pricePerHour: ['', Validators.required],
      pricePerDay: ['', Validators.required],
      images: this.fb.array([this.fb.control('')])
    });
  }
  get images(): FormArray {
    return this.vehicleForm.get('images') as FormArray;
  }
  addImageField(): void {
    this.images.push(this.fb.control(''));
  }
  removeImageField(index: number): void {
    this.images.removeAt(index);
  }

   onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);

    this.imagePreviews = [];
    this.selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreviews.push(e.target.result);
      reader.readAsDataURL(file);
    });
  }

   onSubmit() {
    if (this.vehicleForm.invalid) {
      this.errorMessage = "Please fill all required fields.";
      return;
    }

    this.vehicleService.registerVehicle(this.vehicleForm.value).subscribe({
      next: (vehicle) => {
        const vehicleId = vehicle.id;
        this.successMessage = "Vehicle registered successfully! Uploading images...";

        if (this.selectedFiles.length > 0) {
          this.selectedFiles.forEach(file => {
            this.vehicleService.uploadImage(vehicleId, file).subscribe({
              next: () => console.log("Image uploaded successfully"),
              error: (err) => console.error("Image upload failed", err)
            });
          });
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = "Vehicle registration failed.";
      }
    });
  }
}
