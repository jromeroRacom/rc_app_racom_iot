import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RolesTableService {

  private url: string = environment.apiHost;     // Host
  private port: number = environment.apiPort;    // Puerto
  private apiPath: string = environment.apiPath; // Path
  private apiUri: string;                       // String para hacer url completa

  /** Constructor */
  constructor(private http: HttpClient) {
    this.apiUri = `${this.url}:${this.port}/${this.apiPath}`; // Crea URL
  }
  /* --------------------------------------- */

  /** API de obtener lista de roles */
  getRoles(): Observable<any> {
    return this.http.get(`${this.apiUri}/users/admin/roles/get-all`, {
      params: new HttpParams()
        .set('offset', '0')
        .set('limit', '1000')
    });
  }
  /* --------------------------------------- */

  /** API de crear rol */
  addRole(role: string): Observable<any> {
    return this.http.post(`${this.apiUri}/users/admin/roles`, {role});
  }
  /* --------------------------------------- */

  /** API de actualizar rol */
  updateRole(role: string, nrole: string): Observable<any> {
    return this.http.put(`${this.apiUri}/users/admin/roles/${role}`, {nrole});
  }
  /* --------------------------------------- */

  /** API de eliminar rol */
  deleteRole(role: string): Observable<any> {
    return this.http.delete(`${this.apiUri}/users/admin/roles/${role}`);
  }
  /* --------------------------------------- */
}
