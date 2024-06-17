import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RecetteService {
  private baseUrl = 'http://127.0.0.1:8000/recette/';  // Assurez-vous que cette URL est correcte

  constructor(private http: HttpClient, private authService : AuthService) { }
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

getRecettes(page: number = 1, itemsPerPage: number = 5): Observable<any> {
  const headers = this.getHeaders();
  let params = new HttpParams()
    .set('page', page.toString())
    .set('page_size', itemsPerPage.toString());

  return this.http.get<any>(this.baseUrl, { headers, params });
}

getRecettesChauffeur(id: number, page: number = 1, pageSize: number = 5): Observable<any> {
 
  let params = new HttpParams()
    .set('page', page.toString())
    .set('page_size', pageSize.toString());
  const headers = this.getHeaders()
  return this.http.get<any>(`${this.baseUrl}chauffeur/${id}/`, { params, headers });
}

  getRecette(id: number): Observable<any> {
    const headers = this.getHeaders()
    return this.http.get<any>(`${this.baseUrl}${id}`, {headers});
  }

  createRecette(recette: any): Observable<any> {
    const headers = this.getHeaders()
    return this.http.post<any>(this.baseUrl, recette, {headers});
  }

  updateRecette(id: number, recette: any): Observable<any> {
    const headers = this.getHeaders()
    return this.http.put<any>(`${this.baseUrl}${id}`, recette, {headers});
  }

  deleteRecette(id: number): Observable<void> {
    const headers = this.getHeaders()
    return this.http.delete<void>(`${this.baseUrl}${id}`, {headers});
  }

  // Récupérer les chauffeurs en contrat
  getChauffeursEnContrat(): Observable<any[]> {
    const headers = this.getHeaders()
    return this.http.get<any[]>(`${this.baseUrl}utilisateur/enContrat/`, {headers});
  }
}
