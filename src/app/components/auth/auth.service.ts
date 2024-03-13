import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  Observable } from 'rxjs';


import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

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

  /** API de login */
  login(email: string , password: string): Observable<any>{
    return this.http.post(`${this.apiUri}/users/auth/login`, {email, password});
  }
  /* --------------------------------------- */

  /** API de logout */
  logout(): Observable<any>{
    return this.http.patch(`${this.apiUri}/users/auth/logout`, {});
  }
  /* --------------------------------------- */

  /** API de registrar */
  register(name: string, email: string , password: string): Observable<any>{
    return this.http.post(`${this.apiUri}/users/user`, {name, password, email});
  }
  /* --------------------------------------- */

  /** API de validar usuario */
  validateUser( token: string ): Observable<any>{
    return this.http.get(`${this.apiUri}/users/user/validate/${ token }`);
  }
  /* --------------------------------------- */

  /** API de validar cambio de usuario */
  validateChangeUser( token: string ): Observable<any>{
    return this.http.get(`${this.apiUri}/users/user/validate-update/${ token }`);
  }
  /* --------------------------------------- */

  /** API de cambiar contraseña */
  getPassReset(email: string ): Observable<any>{
    return this.http.post(`${this.apiUri}/users/reset-pass`, {email});
  }
  /* --------------------------------------- */

  /** API de cambiar contraseña */
  doPassReset(password: string, token: string ): Observable<any>{
    return this.http.patch(`${this.apiUri}/users/reset-pass/${ token }`, {password});
  }
  /* --------------------------------------- */








  /***********************************************************/

}
