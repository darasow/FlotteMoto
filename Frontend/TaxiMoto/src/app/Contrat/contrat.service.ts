import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Utilisateur } from '../interface/Utilisateur';

@Injectable({
  providedIn: 'root'
})
export class ContratService {
  private localHost = 'http://127.0.0.1:8000'
  constructor(private http: HttpClient, private authService : AuthService) { }

  getAllContrats(page : number = 1, itemsPerPage : number = 5): Observable<any> {
    const headers = this.getHeaders();
    let params = new HttpParams()
    .set('page', page.toString())
    .set('page_size', itemsPerPage.toString());

    return this.http.get<any[]>(`${this.localHost}/contrat/`, { headers, params});
  }

  getContrat(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.localHost}/contrat/${id}`, { headers });
  }

  addContrat(contrat: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.localHost}/contrat/`, contrat, { headers });
  }

  updateContrat(id: number, contrat: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<any>(`${this.localHost}/contrat/${id}`, contrat, { headers });
  }

  deleteContrat(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.localHost}/contrat/${id}`, { headers });
  }

  // Recuperer tout les contrat en cours
  getContratsEnCours(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.localHost}/contrat/en_cours/`, { headers });
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}
