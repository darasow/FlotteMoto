import { Component } from '@angular/core';
import { Utilisateur } from './interface/Utilisateur';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUser: any | null = null;
  user: Utilisateur | null = null;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {

  }
}
