import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  Observable } from 'rxjs';


import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  private url: string = environment.apiHost;     // Host
  private port: number = environment.apiPort;    // Puerto
  private apiPath: string = environment.apiPath; // Path
  private apiUri: string ;                       // String para hacer url completa

  /** Constructor */
  constructor(private http: HttpClient) {
    this.apiUri = `${this.url}:${this.port}/${this.apiPath}`;   // Crea URL
  }
  /* --------------------------------------- */

  /******************* APIS  *******************/

  /** API de actualizar usuario */
  userDataUpdate( nname: string, nemail: string, password?: string, npassword ?: string): Observable<any>{
    return this.http.put(`${this.apiUri}/users/user/update`, {nemail, password, nname, npassword});
  }
  /* --------------------------------------- */


  /** API de borrar cuenta de usuario */
  userDisableAccount( password?: string): Observable<any>{
    return this.http.patch(`${this.apiUri}/users/user/disable`, { password});
  }
  /* --------------------------------------- */


  /** API de obtener dispositivos de usuario */
  userGetDevices(offset: number = 0, limit: number = 50 ): Observable<any>{
    return this.http.get(`${this.apiUri}/devices/user/get-all?offset:${offset}&limit:${limit}`);
  }
  /* --------------------------------------- */

  /** API de asignar dispositivo a usuario */
  userAssingDevice( serial: string, alias: string): Observable<any>{
    return this.http.put(`${this.apiUri}/devices/user/assign/${serial}`, {alias});
  }
  /* --------------------------------------- */

   /** API de actualizar un dispositivo */
  userUpdateDevice(serial: string, alias: string): Observable<any> {
   return this.http.patch(`${this.apiUri}/devices/user/update/${serial}`, {alias});
  }
  /* --------------------------------------- */


  /** API de borrar dispositivos de usuario */
  userDeleteAllDevices( password?: string): Observable<any>{
    return this.http.patch(`${this.apiUri}/devices/user/delete-all`, { password});
  }
  /* --------------------------------------- */

  /** API de adquiir dispositivo por serial */
  userGetDeviceData( type: string, serial: string): Observable<any>{
    return this.http.get(`${this.apiUri}/devices/user/get/${type}/${serial}`);
  }
  /* --------------------------------------- */

  /** API de adquiir estatus de dispositivo */
  userGetDeviceStatus( serial: string): Observable<any>{
    return this.http.get(`${this.apiUri}/devices/status/${serial}`);
  }
  /* --------------------------------------- */

  /** API de adquiir estatus de dispositivo */
  userGetDeviceCredentials( serial: string): Observable<any>{
    return this.http.get(`${this.apiUri}/devices/mqtt/${serial}`);
  }
  /* --------------------------------------- */





}
