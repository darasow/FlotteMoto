import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MotoService {

  private localHost = 'http://127.0.0.1:8000'

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  
  searchMotos(query: string, filter: string, page: number = 1, itemsPerPage: number = 5): Observable<any> {
    let params = `page=${page}&size=${itemsPerPage}`;
    const headers = this.getHeaders()
    if (query) {
      params += `&search=${query}`;
    }
    if (filter && filter !== 'All') {
      params += `&filter=${filter}`;
    }
    return this.http.get<any>(`${this.localHost}/moto/?${params}`, {headers});
  }

  getMotos(page : number = 1, itemsPerPage : number = 5): Observable<any> {
    const headers = this.getHeaders()
    let params = new HttpParams()
    .set('page', page.toString())
    .set('page_size', itemsPerPage.toString());
    return this.http.get<any[]>(`${this.localHost}/moto/`, { headers, params});
  }

  getMotosEncontratTypeEmbauche(): Observable<any[]> {
    const headers = this.getHeaders()
    return this.http.get<any[]>(`${this.localHost}/moto/enContrat/embauche/`, { headers});
  }

  createMoto(motoData: any): Observable<any> {
    const headers = this.getHeaders()
    return this.http.post<any>(`${this.localHost}/moto/`, motoData, { headers });
  }
  getMotosLibre(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.localHost}/moto/libre/`, { headers });
  }
  
  updateMoto(motoId: number, motoData: any): Observable<any> {
    const headers = this.getHeaders()
    return this.http.put<any>(`${this.localHost}/moto/${motoId}`, motoData, { headers });
  }

  deleteMoto(motoId: number): Observable<any> {
    const headers = this.getHeaders()
    return this.http.delete<any>(`${this.localHost}/moto/${motoId}`, { headers });
  }
}
