// role.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment';

export interface Role {
  id: number;
  name: string;
  authorization_level: number;
  status: number;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = 'http://127.0.0.1:8000/roles/'


  constructor(private http: HttpClient) {}

  getRoles(page: number = 1): Observable<{ roles: Role[], totalPages: number }> {
    return this.http.get<{ roles: Role[], totalPages: number }>(`${this.apiUrl}?page=${page}`);
  }

  createRole(role: Role): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, role);
  }

  updateRole(role: Role): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrl}${role.id}/`, role);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
