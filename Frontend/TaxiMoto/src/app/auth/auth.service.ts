import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, catchError, map, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private refreshTokenInProgress = false;
  private readonly refreshTokenEndpoint = 'http://127.0.0.1:8000/api/token/refresh/';

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
      .pipe(
        map(response => {
          // Récupérer les informations de l'utilisateur depuis la réponse
          localStorage.setItem('currentUser', JSON.stringify(response)); // Stocker les tokens et les informations de l'utilisateur
          this.currentUserSubject.next(response);
          return response;
        })
      );
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

  isTokenExpiring(token: string): boolean {
    if (!token) return true;
    const decodedToken = this.decodeToken(token);
    const expiration = decodedToken.exp * 1000; // Convertir en millisecondes
    const now = Date.now();
    return expiration - now < 60000; // Considéré comme expiring si moins d'une minute reste
  }

  refreshToken(): Observable<any> {
    if (this.refreshTokenInProgress) {
      return of(null); // Déjà en cours de rafraîchissement
    }

    const currentUser = this.currentUserValue;
    if (!currentUser || !currentUser.refresh) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    this.refreshTokenInProgress = true;

    return this.http.post<any>(this.refreshTokenEndpoint, { refresh: currentUser.refresh })
      .pipe(
        tap(response => {
          currentUser.access = response.access;
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          this.currentUserSubject.next(currentUser);
          this.refreshTokenInProgress = false;
        }),
        catchError(error => {
          this.logout();
          this.refreshTokenInProgress = false;
          return throwError(() => new Error(error));
        })
      );
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }
}
