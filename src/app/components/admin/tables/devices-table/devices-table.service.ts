import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DevicesTableService {

  private url: string = environment.apiHost;     // Host
  private port: number = environment.apiPort;    // Puerto
  private apiPath: string = environment.apiPath; // Path
  private apiUri: string;                       // String para hacer url completa

  // private action: string;

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
  getDevices(userId: number): Observable<any> {
    let path = `${this.apiUri}/devices/get-all`;

    if (userId !== 0){ path = `${this.apiUri}/devices/get-all/${userId}`; }

    return this.http.get(path, {
      params: new HttpParams()
        .set('offset', '0')
        .set('limit', '1000')     // Obtiene todos los usuarios (ver nota de arriba)
    });
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
  addDevice(type: string, alias: string): Observable<any> {
    return this.http.post(`${this.apiUri}/devices`, {type, alias});
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
