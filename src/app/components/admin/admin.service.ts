import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private url: string = environment.apiHost;     // Host
  private port: number = environment.apiPort;    // Puerto
  private apiPath: string = environment.apiPath; // Path
  private apiUri: string;                       // String para hacer url completa

  /** Constructor */
  constructor(private http: HttpClient) {
    this.apiUri = `${this.url}:${this.port}/${this.apiPath}`; // Crea URL
  }
  /* --------------------------------------- */

  /** API de obtener permisivo de admin */
  validatePermissive(password: string): Observable<any> {
    return this.http.post(`${this.apiUri}/users/admin/validate`, {password});
  }
  /* --------------------------------------- */

  /** API de obtener usuarip por id  */
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUri}/users/admin/users/get/${id}`, {});
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

  /** API de eliminar usuario */
  deleteUser(email: string): Observable<any> {
    return this.http.delete(`${this.apiUri}/users/admin/users/${email}`, {});
  }
  /* --------------------------------------- */

  /** API de actualizar usuario */
  updateUser(email: string, nemail: string, name: string, role: string, password: string = '' ): Observable<any> {
    return this.http.put(`${this.apiUri}/users/admin/users/${email}`, {nemail, name, role, password });
  }
  /* --------------------------------------- */

  /** API de obtener dispositivo por id  */
  getDeviceById(id: string): Observable<any> {
    return this.http.get(`${this.apiUri}/devices/${id}`, {});
  }
  /* --------------------------------------- */

  /** API de obtener lista de tipos de dispositivod */
  getDeviceTypes(): Observable<any> {
    return this.http.get(`${this.apiUri}/devices/types/get-all`, {
      params: new HttpParams()
        .set('offset', '0')
        .set('limit', '1000')
    });
  }
  /* --------------------------------------- */

  /** API de obtener lista de tipos de dispositivod */
  updateDevice(serial: string, type: string, alias: string): Observable<any> {
    return this.http.put(`${this.apiUri}/devices/${serial}`, {type, alias});
  }
  /* --------------------------------------- */

  /** API de obtener lista de tipos de dispositivod */
  deleteDevice(serial: string): Observable<any> {
    return this.http.delete(`${this.apiUri}/devices/${serial}`, {});
  }
  /* --------------------------------------- */
}
