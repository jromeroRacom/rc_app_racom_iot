import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserDevicesTableService {

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
   * Decidí que para la tabla de usuarios se haría todo el render desde el cliente
   * dado que dudo mucho que se tengan más de 10 dispositivos por usuario, por lo cual
   * no sería eficaz estar haciendo peticiones al servidor cuando se solicita un filtro, sort,
   * o un cambio de página del paginador. En caso de que me equivoque (espero eso) y el usuario comience
   * a tener muchos dispositivos recomiendo hacer la tabla dinamica para que cada que se solicita un cambio
   * haga una solicitud al servidor.
   *
   */

  /******************* APIS  *******************/

  /** API de obtener dispsoitivos de usuario */
  getUserDevices(): Observable<any> {
    return this.http.get(`${this.apiUri}/devices/user/get-all`, {
      params: new HttpParams()
        .set('offset', '0')
        .set('limit', '1000')                 // Obtiene todos los dispositivos (ver nota de arriba)
    });
  }
  /* --------------------------------------- */

  /** API de agregar un dispositivo nuevo */
  assingUserDevice(serial: string, alias: string): Observable<any> {
    return this.http.put(`${this.apiUri}/devices/user/assign/${serial}`, {alias});
  }
  /* --------------------------------------- */

  /** API de actualizar un dispositivo */
  updateUserDevice(serial: string, alias: string): Observable<any> {
    return this.http.patch(`${this.apiUri}/devices/user/update/${serial}`, {alias});
  }
  /* --------------------------------------- */

  /** API de borrar un dispositivo */
  deleteUserDevice(serial: string): Observable<any> {
    return this.http.delete(`${this.apiUri}/devices/user/delete/${serial}`);
  }
  /* --------------------------------------- */

  /** API de borrar algunos dispositivo */
  deleteUserSomeDevices(devices: any): Observable<any> {
    return this.http.patch(`${this.apiUri}/devices/user/delete-some`, {devices});
  }
  /* --------------------------------------- */
}
