import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RecetteService {
  private localHost = 'http://127.0.0.1:8000'

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
  return this.http.get<any>(`${this.localHost}/recette/`, { headers, params });
}

getRecettesChauffeur(id: number, page: number = 1, pageSize: number = 5): Observable<any> {
  let params = new HttpParams()
    .set('page', page.toString())
    .set('page_size', pageSize.toString());
  const headers = this.getHeaders()
  return this.http.get<any>(`${this.localHost}/recette/chauffeur/${id}/`, { params, headers });
}

  getRecette(id: number): Observable<any> {
    const headers = this.getHeaders()
    return this.http.get<any>(`${this.localHost}/recette/${id}`, {headers});
  }

  createRecette(recette: any): Observable<any> {
    const headers = this.getHeaders()
    return this.http.post<any>(`${this.localHost}/recette/`, recette, {headers});
  }

  updateRecette(id: number, recette: any): Observable<any> {
    const headers = this.getHeaders()
    return this.http.put<any>(`${this.localHost}/recette/${id}`, recette, {headers});
  }

  deleteRecette(id: number): Observable<void> {
    const headers = this.getHeaders()
    return this.http.delete<void>(`${this.localHost}/recette/${id}`, {headers});
  }

  // Récupérer les chauffeurs en contrat
  // getChauffeursEnContrat(): Observable<any[]> {
  //   const headers = this.getHeaders()
  //   return this.http.get<any[]>(`${this.localHost}/utilisateur/enContrat/`, {headers});
  // }
  
}
