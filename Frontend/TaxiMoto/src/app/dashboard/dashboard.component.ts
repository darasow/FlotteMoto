// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Utilisateur } from 'src/app/interface/Utilisateur';
import { AuthService } from '../auth/auth.service';
// import DataTable from 'datatables.net-dt';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: any | null = null;
  user: Utilisateur | null = null;
  // table = new DataTable('#myTable');
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.user = this.currentUser
    
  }

}
