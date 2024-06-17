import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MotoService {

  private userApi = 'http://127.0.0.1:8000/moto/'
  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  
  getMotos(page : number = 1, itemsPerPage : number = 5): Observable<any> {
    const headers = this.getHeaders()
    let params = new HttpParams()
    .set('page', page.toString())
    .set('page_size', itemsPerPage.toString());

    return this.http.get<any[]>(`${this.userApi}`, { headers, params});
  }

  getMotosEncontratTypeEmbauche(): Observable<any[]> {
    const headers = this.getHeaders()
    return this.http.get<any[]>(`${this.userApi}enContrat/embauche/`, { headers});
  }

  createMoto(motoData: any): Observable<any> {
    const headers = this.getHeaders()
    return this.http.post<any>(`${this.userApi}`, motoData, { headers });
  }

  updateMoto(motoId: number, motoData: any): Observable<any> {
    const headers = this.getHeaders()

    return this.http.put<any>(`${this.userApi}${motoId}`, motoData, { headers });
  }

  deleteMoto(motoId: number): Observable<any> {
    const headers = this.getHeaders()
    return this.http.delete<any>(`${this.userApi}${motoId}`, { headers });
  }
}
