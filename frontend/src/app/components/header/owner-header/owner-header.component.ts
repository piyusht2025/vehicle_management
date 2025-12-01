import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-owner-header',
  templateUrl: './owner-header.component.html',
  styleUrls: ['./owner-header.component.scss'],
})
export class OwnerHeaderComponent {
  isMenuOpen = false;
  constructor(private router: Router,private authService:AuthService) {}
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  isActive(route: string): boolean {
    return this.router.url === route;
  }
   logOut(){
    if(confirm("Are you sure ")){
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
