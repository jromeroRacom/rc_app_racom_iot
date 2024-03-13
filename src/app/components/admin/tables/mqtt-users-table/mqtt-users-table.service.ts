import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MqttUsersTableService {

  private url: string = environment.apiHost;     // Host
  private port: number = environment.apiPort;    // Puerto
  private apiPath: string = environment.apiPath; // Path
  private apiUri: string;                       // String para hacer url completa

  /** Constructor */
  constructor(private http: HttpClient) {
    this.apiUri = `${this.url}:${this.port}/${this.apiPath}`; // Crea URL
  }
  /* --------------------------------------- */

  /**
   * @note NOTA IMPORTANTE
   * Decidí que para la tabla de dispositivos se haría todo el render desde el cliente
   * dado al inicio tendremos pocos, por lo cual
   * no sería eficaz estar haciendo peticiones al servidor cuando se solicita un filtro, sort,
   * o un cambio de página del paginador.
   *
   */

  /******************* APIS  *******************/

  /** API de obtener lista de usuarios de mqtt */
  getMqttUsers(): Observable<any> {
    return this.http.get(`${this.apiUri}/devices/admin/mqtt/get-users`, {
      params: new HttpParams()
        .set('offset', '0')
        .set('limit', '1000')     // Obtiene todos los usuarios (ver nota de arriba)
    });
  }
  /* --------------------------------------- */

  /** API de crear usuario de mqtt */
  addMqttUsers(username: string, password: string, superuser: boolean): Observable<any> {
    return this.http.post(`${this.apiUri}/devices/admin/mqtt`, {username, password, is_superuser: superuser });
  }
  /* --------------------------------------- */

  /** API de actualizar usuario de mqtt */
  updateMqttUsers(username: string, nusername: string, password: string, superuser: boolean): Observable<any> {
    return this.http.put(`${this.apiUri}/devices/admin/mqtt/${username}`, {nusername, password, is_superuser: superuser });
  }
  /* --------------------------------------- */

  /** API de eliminar usuario de mqtt */
  deleteMqttUsers(username: string): Observable<any> {
    return this.http.delete(`${this.apiUri}/devices/admin/mqtt/${username}`);
  }
  /* --------------------------------------- */
}
