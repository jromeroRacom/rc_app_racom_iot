import { Injectable } from '@angular/core';
import { Subject, Observable, Subscription, fromEvent, timer } from 'rxjs';
import { filter, switchMap, map, startWith, tap, mapTo } from 'rxjs/operators';

import jwt_decode from 'jwt-decode';

import { ExpirationEvent, JWTDecoded } from '../models/auth-token.models';

export const TOKEN_NAME = 'token';                // Nombre de campo de token

/**
 * Servicio de autenticación por token
 */
@Injectable({
  providedIn: 'root'
})
export class AuthTokenService {
  /** Observable para emitir */
  private tokenSubject$ = new Subject<Date|undefined>();
  /** Establece tiempo para disparar evento de casi expirado */
  private timeAlmostExpired: number;
  timeLeftExpired !: number;                               // Tiempo que resta para expirar
  timeLogin !: Date;                                       // Hora de inicio de sesión

  /** Constructor */
  constructor() {
    this.timeAlmostExpired = 15;      // Tiempo para casi expirar
  }
  /* --------------------------------------- */

  /******************* Acciones de token *******************/

  /** Borra token de local storage */
  deleteToken(): void {
    localStorage.setItem(TOKEN_NAME, '');  // Borra en local storage
  }
  /* --------------------------------------- */

  /** Obtiene token de local storage */
  getToken(): string | undefined {
    return localStorage.getItem(TOKEN_NAME) || undefined;  // Obtiene de local storage
  }
  /* --------------------------------------- */

  /** Establece token en local storage */
  setToken(token: string): void {
    localStorage.setItem(TOKEN_NAME, token);   // Establece en local storage
  }
  /* --------------------------------------- */

  /** Obtiene fecha de expiracion de token */
  getTokenExpirationDate(token?: string): Date | undefined {
    if (!token) { token = this.getToken(); }      // Lee token si no viene en parametro
    if (!token) { return undefined; }                  // Si no existe retorna undefined

    const decoded: JWTDecoded = jwt_decode(token);   // Obtiene decodificación de token
    if (decoded.exp === undefined) { return undefined; }  // Si no existe retorna nulo

    const date = new Date(0);              // Obtiene fecha
    date.setUTCSeconds(decoded.exp);       // Convierte expiracion de jwt a UTC
    return date;                           // Retorna fecha
  }
  /* --------------------------------------- */

  /** Obtiene bool si token ya expiró */
  isTokenExpired(token?: string): boolean {
    if (!token) { token = this.getToken(); }      // Lee token si no viene en parametro
    if (!token) { return true; }                  // Si no existe retorna true

    const date = this.getTokenExpirationDate(token) || undefined;  // Obtiene fecha de expiracion de token
    if (date === undefined) { return false; }                      // Si es erronea regresa falso
    return !(date.valueOf() > new Date().valueOf());          // Retorna si aun está activo
  }
  /* --------------------------------------- */
  /***********************************************************/

  /******************* Valores de usuario  *******************/

  /** Obtiene fecha de inicio de sessión */
  getTimeLogin(token?: string): Date | undefined{
    if (!token) { token = this.getToken(); }      // Lee token si no viene en parametro
    if (!token) { return undefined; }                  // Si no existe retorna undefined

    const decoded: JWTDecoded = jwt_decode(token);        // Obtiene decodificación de token
    if (decoded.timestamp === undefined) { return undefined; }  // Si no existe retorna nulo

    return decoded.timestamp;
  }
  /* --------------------------------------- */

  /** Obtiene nombre de usuario de token */
  getUserNameFromToken(token?: string): string | undefined{
    if (!token) { token = this.getToken(); }      // Lee token si no viene en parametro
    if (!token) { return undefined; }                  // Si no existe retorna undefined

    const decoded: JWTDecoded = jwt_decode(token);        // Obtiene decodificación de token
    if (decoded.user?.name === undefined) { return undefined; }  // Si no existe retorna nulo

    return decoded.user.name;
  }
  /* --------------------------------------- */

  /** Obtiene correo de usuario de token */
  getEmailFromToken(token?: string): string | undefined{
    if (!token) { token = this.getToken(); }      // Lee token si no viene en parametro
    if (!token) { return undefined; }                  // Si no existe retorna undefined

    const decoded: JWTDecoded = jwt_decode(token);        // Obtiene decodificación de token
    if (decoded.user?.email === undefined) { return undefined; }  // Si no existe retorna nulo

    return decoded.user.email;
  }
  /* --------------------------------------- */

  /** Obtiene correo de usuario de token */
  getRolFromToken(token?: string): string | undefined{
    if (!token) { token = this.getToken(); }      // Lee token si no viene en parametro
    if (!token) { return undefined; }             // Si no existe retorna undefined

    const decoded: JWTDecoded = jwt_decode(token);        // Obtiene decodificación de token
    if (decoded.user?.role === undefined) { return undefined; }  // Si no existe retorna nulo

    return decoded.user.role;
  }
  /* --------------------------------------- */
  /***********************************************************/

  /******************* Acciones progresivas  *******************/

  /** Subscripción para cuando token expire */
  onTokenExpired(): Observable<ExpirationEvent> {
    return this.tokenSubject$.pipe(
      startWith(this.getTokenExpirationDate()),   // Inicializa hora con token
      // tap( date => console.log(date)),
      switchMap((date) => timer(date)),            // Crea timer de expiracion
      mapTo({ event: 'expired', timeLeft: 0 })     // Emite evento expired
    );
  }
  /* --------------------------------------- */

  /** Subscripción para cuando token casi expire */
  onTokenAlmostExpired(): Observable<ExpirationEvent> {
    return this.tokenSubject$.pipe(
      startWith(this.getTokenExpirationDate()),                                // Inicializa hora con token
      map(value => new Date((value?.valueOf() || 0) - this.timeAlmostExpired * 1000)),  // Quita tiempo de casi expiracion
      // tap( date => console.log(date)),
      switchMap((date) => timer(date)),                                            // Inicia timer que dispara a la hora de exp
      map(event => (this.getTokenExpirationDate()?.valueOf() || 0 ) - Date.now()), // Obtiene el tiempo para expirar
      map(value => ({ event: 'almost', timeLeft: value }))                         // Emite evento almost
    );
  }
  /* --------------------------------------- */

  /** Subscripción para cuando token se borre de local storage */
  onTokenDeleted(): Observable<ExpirationEvent> {
    return fromEvent(window, 'storage').pipe(   // Evento de localStorage
      filter<any>(event => event.key === TOKEN_NAME),                     // Filtra solo si hay cambio en 'token'
      filter<StorageEvent>(event => event.newValue !== event.oldValue),   // Filtra si hubo modificacion en token
      map(value => ({ event: 'deleted' }))                                // Emite evento deleted
    );
  }
  /* --------------------------------------- */
  /***********************************************************/

}
