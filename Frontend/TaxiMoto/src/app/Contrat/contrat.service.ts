import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Utilisateur } from '../interface/Utilisateur';

@Injectable({
  providedIn: 'root'
})
export class ContratService {
  private apiUrl = 'http://127.0.0.1:8000/contrat/'; // L'URL de votre API Contrats
  private apiUrlchauffeur = 'http://127.0.0.1:8000/chauffeur/'; // L'URL de votre API Contrats

  constructor(private http: HttpClient, private authService : AuthService) { }

  getAllContrats(page : number = 1, itemsPerPage : number = 5): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams()
    .set('page', page.toString())
    .set('page_size', itemsPerPage.toString());

    return this.http.get<any[]>(`${this.apiUrl}`, { headers, params});
  }

  getContrat(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}${id}`, { headers });
  }
getchauffeur(id : number)
{
  const headers = this.getHeaders();
  return this.http.get<any>(`${this.apiUrlchauffeur}${id}`, {headers})
}
getChauffeurByUsername(username : String)
{
  const headers = this.getHeaders();
  return this.http.get<any>(`${this.apiUrlchauffeur}username/${username}`, {headers})
}


  addContrat(contrat: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(this.apiUrl, contrat, { headers });
  }

  updateContrat(id: number, contrat: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<any>(`${this.apiUrl}${id}`, contrat, { headers });
  }

  deleteContrat(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}${id}`, { headers });
  }

  getMotos(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>('http://127.0.0.1:8000/moto/libre/', { headers });
  }
  getChauffeurs(): Observable<Utilisateur[]> {
    const headers = this.getHeaders();
    return this.http.get<Utilisateur[]>('http://127.0.0.1:8000/utilisateur/libre/', { headers });
  }
  getContratsEnCours(): Observable<Utilisateur[]> {
    const headers = this.getHeaders();
    return this.http.get<Utilisateur[]>('http://127.0.0.1:8000/contrat/en_cours/', { headers });
  }


  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}
