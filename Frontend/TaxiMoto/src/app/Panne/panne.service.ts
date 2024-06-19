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
  private localHost = 'http://127.0.0.1:8000'

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
    return this.http.get<Panne[]>(`${this.localHost}/panne/`, {headers, params});
  }
  searchPannes(query: string, filter: string, page: number = 1, itemsPerPage: number = 5): Observable<any> {
    let params = `page=${page}&size=${itemsPerPage}`;
    const headers = this.getHeaders()
    if (query) {
      params += `&search=${query}`;
    }
    if (filter && filter !== 'All') {
      params += `&filter=${filter}`;
    }
    return this.http.get<any>(`${this.localHost}/panne/?${params}`, {headers},);
  }
  
  getPannesChauffeur(chauffeur_id : number, page : number = 1, itemsPerPage : number = 5): Observable<any> {
    const headers = this.getHeaders()
    let params = new HttpParams()
    .set('page', page.toString())
    .set('page_size', itemsPerPage.toString());
    return this.http.get<Panne[]>(`${this.localHost}/panne/chauffeur/${chauffeur_id}/`, {headers, params});
  }

  getPanne(id: number): Observable<Panne> {
    const headers = this.getHeaders()
    return this.http.get<Panne>(`${this.localHost}/panne/${id}`, {headers});
  }

  createPanne(panne: Panne): Observable<Panne> {
    const headers = this.getHeaders()
    return this.http.post<Panne>(`${this.localHost}/panne/`, panne, {headers});
  }

  updatePanne(id: number, panne: Panne): Observable<Panne> {
    const headers = this.getHeaders()
    return this.http.put<Panne>(`${this.localHost}/panne/${id}`, panne, {headers});
  }

  deletePanne(id: number): Observable<void> {
    const headers = this.getHeaders()
    return this.http.delete<void>(`${this.localHost}/panne/${id}`, {headers});
  }
}
