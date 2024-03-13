import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionsTableService {

  private url: string = environment.apiHost;     // Host
  private port: number = environment.apiPort;    // Puerto
  private apiPath: string = environment.apiPath; // Path
  private apiUri: string;                       // String para hacer url completa

  /** Constructor */
  constructor(private http: HttpClient) {
    this.apiUri = `${this.url}:${this.port}/${this.apiPath}`; // Crea URL
  }
  /* --------------------------------------- */

  /** API de obtener lista de sesiones */
  getSessions(userId: number): Observable<any> {
    let path = `${this.apiUri}/users/admin/sessions/get-all`;

    if (userId !== 0){ path = `${this.apiUri}/users/admin/sessions/get-all/${userId}`; }

    return this.http.get(path, {
      params: new HttpParams()
        .set('offset', '0')
        .set('limit', '1000')     // Obtiene todos los usuarios (ver nota de arriba)
    });
  }
  /* --------------------------------------- */

  /** API eliminar sesion */
  deleteSession(session: string): Observable<any> {
    return this.http.delete(`${this.apiUri}/users/admin/sessions/${session}`, );
  }
  /* --------------------------------------- */
}
