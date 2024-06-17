import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entretien } from '../interface/Entretien';

@Injectable({
  providedIn: 'root'
})
export class EntretienService {

  private apiUrl = 'http://127.0.0.1:8000/entretien/'

  constructor(private http: HttpClient, private authService: AuthService) {}
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getEntretiens(page : number = 1, itemsPerPage : number = 5): Observable<any> {
    const headers = this.getHeaders()
    let params = new HttpParams()
    .set('page', page.toString())
    .set('page_size', itemsPerPage.toString());
    
    return this.http.get<Entretien[]>(`${this.apiUrl}`, {headers, params});
  }

  getEntretien(id: number): Observable<Entretien> {
    const headers = this.getHeaders()
    return this.http.get<Entretien>(`${this.apiUrl}${id}`, {headers});
  }

  createEntretien(Entretien: Entretien): Observable<Entretien> {
    const headers = this.getHeaders()
    return this.http.post<Entretien>(this.apiUrl, Entretien, {headers});
  }

  updateEntretien(id: number, Entretien: Entretien): Observable<Entretien> {
    const headers = this.getHeaders()
    return this.http.put<Entretien>(`${this.apiUrl}${id}`, Entretien, {headers});
  }
  getEntretiensChauffeur(chauffeur_id : number, page : number = 1, itemsPerPage : number = 5): Observable<any> {
    const headers = this.getHeaders()
    let params = new HttpParams()
    .set('page', page.toString())
    .set('page_size', itemsPerPage.toString());
    return this.http.get<Entretien[]>(`${this.apiUrl}chauffeur/${chauffeur_id}/`, {headers, params});
  }
  
  deleteEntretien(id: number): Observable<void> {
    const headers = this.getHeaders()
    return this.http.delete<void>(`${this.apiUrl}${id}`, {headers});
  }
}
