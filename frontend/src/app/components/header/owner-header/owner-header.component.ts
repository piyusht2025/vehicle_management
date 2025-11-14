import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-owner-header',
  templateUrl: './owner-header.component.html',
  styleUrls: ['./owner-header.component.scss'],
})
export class OwnerHeaderComponent {
  isMenuOpen = false;
  constructor(private router: Router) {}
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
