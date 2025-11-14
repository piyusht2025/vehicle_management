import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit{
  constructor(private userService : UserService){}
  users:any[]=[];

  ngOnInit(){
    this.userService.getAllUsers().subscribe({
      next:(data)=>{
        this.users=data;
        console.log(this.users);
      }
    });


}
}
