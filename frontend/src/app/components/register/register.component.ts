import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  name = '';
  email = '';
  phone = '';
  password = '';
  license='';
  role = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    const user = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password,
      licenseNo:this.license,
      role: this.role
    };

    this.authService.register(user).subscribe(
      () => {
        alert("Registration successful!");
        this.router.navigate(['/login']);
      },
      err => alert("Failed: " + err.error)
    );
  }
}
