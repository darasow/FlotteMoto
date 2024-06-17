// panne.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Panne } from '../interface/Panne';
import { AuthService } from '../auth/auth.service';
@Injectable({
  providedIn: 'root'
})
export class PanneService {
  private apiUrl = 'http://127.0.0.1:8000/panne/'

  constructor(private http: HttpClient, private authService: AuthService) {}
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getPannes(page : number = 1, itemsPerPage : number = 5): Observable<any> {
    const headers = this.getHeaders()
    let params = new HttpParams()
    .set('page', page.toString())
    .set('page_size', itemsPerPage.toString());
    return this.http.get<Panne[]>(`${this.apiUrl}`, {headers, params});
  }
  getPannesChauffeur(chauffeur_id : number, page : number = 1, itemsPerPage : number = 5): Observable<any> {
    const headers = this.getHeaders()
    let params = new HttpParams()
    .set('page', page.toString())
    .set('page_size', itemsPerPage.toString());
    return this.http.get<Panne[]>(`${this.apiUrl}chauffeur/${chauffeur_id}/`, {headers, params});
  }

  getPanne(id: number): Observable<Panne> {
    const headers = this.getHeaders()
    return this.http.get<Panne>(`${this.apiUrl}${id}`, {headers});
  }

  createPanne(panne: Panne): Observable<Panne> {
    const headers = this.getHeaders()
    return this.http.post<Panne>(this.apiUrl, panne, {headers});
  }

  updatePanne(id: number, panne: Panne): Observable<Panne> {
    const headers = this.getHeaders()
    return this.http.put<Panne>(`${this.apiUrl}${id}`, panne, {headers});
  }

  deletePanne(id: number): Observable<void> {
    const headers = this.getHeaders()
    return this.http.delete<void>(`${this.apiUrl}${id}`, {headers});
  }
}
