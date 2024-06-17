import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Utilisateur } from '../interface/Utilisateur';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit{
logout(user : Utilisateur) {
  if(confirm(`Voullez vous deconnectez ${user.username}`))
  {
    
    this.authService.logout();
  }
    
}

  currentUser: any | null = null;
  user: any | null = null;
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.user = this.currentUser.user
    
  }

 
 
}
