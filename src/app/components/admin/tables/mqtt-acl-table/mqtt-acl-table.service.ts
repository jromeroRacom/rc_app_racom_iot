import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MqttAclTableService {

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

  /** API de obtener lista de firmwares */
  getMqttAcl(): Observable<any> {
    return this.http.get(`${this.apiUri}/devices/admin/mqtt/get-acl`, {
      params: new HttpParams()
        .set('offset', '0')
        .set('limit', '1000')     // Obtiene todos los usuarios (ver nota de arriba)
    });
  }
  /* --------------------------------------- */

  /** API de obtener lista de firmwares */
  updateMqttAcl(username: string, allow: boolean, topic: string, access: number): Observable<any> {
    return this.http.put(`${this.apiUri}/devices/admin/mqtt/acl/${username}`, {allow, topic, access});
  }
  /* --------------------------------------- */
}
