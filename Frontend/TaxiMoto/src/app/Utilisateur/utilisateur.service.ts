import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur } from '../interface/Utilisateur';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  private apiUrl = 'http://127.0.0.1:8000'; // Remplacez par votre URL API

  constructor(private http: HttpClient, private authService : AuthService) { }
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  
  getUtilisateurs(page: number = 1, itemsPerPage: number = 5): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', itemsPerPage.toString());
    return this.http.get<any>(`${this.apiUrl}/utilisateur/`, { params });
  }

  createUtilisateur(userData: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.apiUrl}/utilisateur/`, userData);
  }

  updateUtilisateur(id: number, userData: Utilisateur): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.apiUrl}/utilisateur/${id}`, userData);
  }

  deleteUtilisateur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/utilisateur/${id}`);
  }

  getUtilisateur(id: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/utilisateur/${id}`);
  }

  getChauffeursLibre(): Observable<Utilisateur[]> {
    // const headers = this.getHeaders();
    return this.http.get<Utilisateur[]>(`${this.apiUrl}/utilisateur/libre/`);
  }
}
