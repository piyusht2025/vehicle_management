import { Component } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-admin-users-list',
  templateUrl: './admin-users-list.component.html',
  styleUrls: ['./admin-users-list.component.scss']
})
export class AdminUsersListComponent {
  constructor(private userService : UserService){}
    users:any[]=[];

    ngOnInit(){
      this.userService.getAllUsers().subscribe({
        next:(data)=>{
          this.users=data;
        }
      });
}
}
