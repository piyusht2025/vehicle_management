import { AuthService } from 'src/app/core/services/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})


export class HeaderComponent {
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
