import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}
login() {
  this.authService.login({ email: this.email, password: this.password }).subscribe(
    () => {
      const roles = this.authService.getUserRoles(); // <-- correct call
      console.log(roles);

      if (roles.includes('ROLE_OWNER')) {
        this.router.navigate(['owner/dashboard']);
      }
      else if (roles.includes('ROLE_ADMIN')) {
        this.router.navigate(['admin/dashboard']);
      }
      else {
        this.router.navigate(['user/dashboard']);
      }
    },
    () => alert("Invalid credentials")
  );
}

}
