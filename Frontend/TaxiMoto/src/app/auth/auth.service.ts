import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Utilisateur } from '../interface/Utilisateur';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.getValue();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>('http://127.0.0.1:8000/api/token/', { username, password })
      .pipe(map(response => {
        // Récupérer les informations de l'utilisateur depuis la réponse
        localStorage.setItem('currentUser', JSON.stringify(response)); // Stocker les tokens et les informations de l'utilisateur
        this.currentUserSubject.next(response);
        return response;
      }));
  }

  logout() {
    console.log("Déconnexion...");
    // Retirer les informations de l'utilisateur de localStorage
    localStorage.removeItem('currentUser');
    // Vérifiez immédiatement après la suppression
    if (!localStorage.getItem('currentUser')) {
      console.log("Stockage local nettoyé avec succès.");
    } else {
      console.error("Échec du nettoyage du stockage local.");
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): any {
    const currentUser = this.currentUserValue;
    return currentUser && currentUser.access ? currentUser.access : null;
  }

  getCurrentUser(): any {
    const currentUser = this.currentUserValue;
    return currentUser && currentUser.user ? currentUser.user : null;
  }
}
