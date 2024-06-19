// Importation des modules nécessaires depuis Angular et RxJS
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, catchError, map, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Permet d'injecter le service au niveau de la racine de l'application
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>; // Utilisé pour stocker l'utilisateur courant
  public currentUser: Observable<any>; // Observable pour l'utilisateur courant
  private refreshTokenInProgress = false; // Indique si un rafraîchissement du token est en cours
  private readonly refreshTokenEndpoint = 'http://127.0.0.1:8000/api/token/refresh/'; // URL pour rafraîchir le token

  constructor(private http: HttpClient, private router: Router) {
    // Récupération de l'utilisateur stocké dans le localStorage au démarrage
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable(); // Convertit le BehaviorSubject en observable
  }

  // Récupère la valeur actuelle de l'utilisateur courant
  public get currentUserValue(): any {
    return this.currentUserSubject.getValue();
  }

  // Méthode de connexion
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>('http://127.0.0.1:8000/api/token/', { username, password })
      .pipe(
        map(response => {
          // Stocker les informations de l'utilisateur et les tokens dans le localStorage
          localStorage.setItem('currentUser', JSON.stringify(response));
          this.currentUserSubject.next(response); // Met à jour le BehaviorSubject
          return response; // Retourne la réponse pour d'autres usages éventuels
        })
      );
  }

  // Méthode de déconnexion
  logout() {
    console.log("Déconnexion...");
    // Supprime les informations de l'utilisateur du localStorage
    localStorage.removeItem('currentUser');
    // Vérifie la suppression
    if (!localStorage.getItem('currentUser')) {
      console.log("Stockage local nettoyé avec succès.");
    } else {
      console.error("Échec du nettoyage du stockage local.");
    }
    this.currentUserSubject.next(null); // Réinitialise l'utilisateur courant
    this.router.navigate(['/login']); // Redirige vers la page de connexion
  }

  // Récupère le token d'accès
  getToken(): any {
    const currentUser = this.currentUserValue;
    return currentUser && currentUser.access ? currentUser.access : null; // Retourne le token ou null
  }

  // Récupère l'utilisateur courant
  getCurrentUser(): any {
    const currentUser = this.currentUserValue;
    return currentUser && currentUser.user ? currentUser.user : null; // Retourne l'utilisateur ou null
  }

  // Vérifie si le token est sur le point d'expirer
  isTokenExpiring(token: string): boolean {
    if (!token) return true;
    const decodedToken = this.decodeToken(token); // Décode le token
    const expiration = decodedToken.exp * 1000; // Convertit l'expiration en millisecondes
    const now = Date.now();
    return expiration - now < 60000; // Considéré comme expirant si moins d'une minute reste
  }

  // Méthode pour rafraîchir le token
  refreshToken(): Observable<any> {
    if (this.refreshTokenInProgress) {
      return of(null); // Si un rafraîchissement est déjà en cours, retourne null
    }

    const currentUser = this.currentUserValue;
    if (!currentUser || !currentUser.refresh) {
      this.logout(); // Déconnecte si pas de token de rafraîchissement
      return throwError(() => new Error('No refresh token available'));
    }

    this.refreshTokenInProgress = true; // Indique qu'un rafraîchissement est en cours

    return this.http.post<any>(this.refreshTokenEndpoint, { refresh: currentUser.refresh })
      .pipe(
        tap(response => {
          // Met à jour le token d'accès avec la nouvelle valeur
          currentUser.access = response.access;
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          this.currentUserSubject.next(currentUser); // Met à jour le BehaviorSubject
          this.refreshTokenInProgress = false; // Fin du processus de rafraîchissement
        }),
        catchError(error => {
          this.logout(); // Déconnecte en cas d'erreur
          this.refreshTokenInProgress = false; // Fin du processus de rafraîchissement
          return throwError(() => new Error(error)); // Propagation de l'erreur
        })
      );
  }

  // Méthode pour décoder le token JWT
  private decodeToken(token: string): any {
    try {
      // Decode la partie payload du token
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null; // Retourne null en cas d'échec du décodage
    }
  }
}
