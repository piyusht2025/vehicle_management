import { Component } from '@angular/core';
import { UserService } from 'src/app/features/user/services/user.service';

@Component({
  selector: 'app-admin-users-list',
  templateUrl: './admin-users-list.component.html',
  styleUrls: ['./admin-users-list.component.scss'],
})
export class AdminUsersListComponent {
  showModal: boolean = false;
  selectedUser: any = null;

  constructor(private userService: UserService) {}
  users: any[] = [];

  ngOnInit() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
    });
  }

  openModal(user:any):void{
    console.log(user);

    this.selectedUser=user;
    this.showModal=true;
  }
  closeModal(): void {
    this.showModal = false;
    this.selectedUser = null;
  }
}
