import { Injectable } from '@angular/core';
import { nanoid } from 'nanoid';
import { Subject, fromEvent, Observable, Subscription } from 'rxjs';
import { filter, tap, mapTo, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TabSessionService {

  sesionId: string;                    // Alias de sesion
  sessionArray: string[] = [];         // Array de alias
  isMainSession = false;               // Es pagina principal ?
  initialized = false;                 // Bandera de iniciar
  isNewWindowPromotedToMain = null;   // Bandera de nueva pestaña en main
  onWindowUpdated = null;             // Callback determina estado de pagina
  sessionSubject$ = new Subject<string>(); // Observable para emitir estado de sesion

  /** Constructor */
  constructor() {
    window.onbeforeunload = () => this.deleteSesion(); // Acción antes de cerrar
    window.onunload = () => this.deleteSesion();       // Acción al cerrar

    this.sesionId = nanoid(10);         // Crea sesion id
  }
  /* --------------------------------------- */

  /**
   * Obtiene sesión Id
   * @returns Retorna sesion id
   */
  getSessionId(): string { return this.sesionId; }
  /* --------------------------------------- */

  /**
   * Regresa sesiones actuales
   * @returns sesiones actuales
   */
  getSessions(): any {
    const sessionArray = localStorage.getItem('alias');  // Obtiene arreglo de alias

    if (sessionArray === null || sessionArray === 'NaN' || sessionArray === '') { return [] ; } // Si no existe lo pone vacio
    else { return JSON.parse(sessionArray); }                                                   // Arreglo en json
  }
  /* --------------------------------------- */

  /**
   * Obtiene número de sesiones activas
   * @returns Numero de sesiones activas
   */
  getSessionsActive(): number{
    return this.getSessions().length;
  }
  /* --------------------------------------- */

  /**
   * Realiza la lógica para saber en que estatus de sesión se encuentra
   * @returns Estatus de sesión
   */
  getSessionStatus(): string {
    const sessionArray: any = this.getSessions(); // Obtiene arreglo de alias

    if (this.initialized) {
      if (sessionArray.length === 0) {          // Caso si se borra el alias
        this.isMainSession = false;
        this.initialized = false;
        return 'error';
      }
      else if (sessionArray[0] === this.sesionId) { this.isMainSession = true; }  // Primer elemento de la lista es sessionId
      else { this.isMainSession = false; }                                        // No está en el 1er elemento

    } else {                                 // No está iniciado
      if (sessionArray.length === 0) {       // Si no hay arreglo
        this.isMainSession = true;           // Pone como pagina main
        sessionArray[0] = this.sesionId;     // Pone al arreglo el primer elemento
      }
      else {
        sessionArray. unshift(this.sesionId);     // Agrega al arreglo el alias
        this.isMainSession = true;                // Ya hay paginas iniciadas
      }
      localStorage.setItem('alias', JSON.stringify(sessionArray)); // Actualiza local storage
      this.initialized = true;                           // Establece bandera de iniciado
    }

    return this.isMainSession ? 'main' : 'child';
  }
  /* --------------------------------------- */

  /** Borra sesión de local storage */
  deleteSesion(): void {                                   // Borra sesión
    this.initialized = false;                                                // sesactiva bandera de inicializado
    if (localStorage.getItem('alias')) {                                     // Si aun existe el elemento
      this.sessionArray = JSON.parse(localStorage.getItem('alias') || '[]'); // Parsea en json
      const indexAlias = this.sessionArray.indexOf(this.sesionId);           // Busca si existe alias
      if (indexAlias !== -1) { this.sessionArray.splice(indexAlias, 1); }    // Borra de arreglo
      localStorage.setItem('alias', JSON.stringify(this.sessionArray));      // Pone arreglo nuevo
    }
    this.sesionId = nanoid(10);                                              // Genera nuevo alias
  }
  /* --------------------------------------- */

  /** Borra todas las sesiones  */
  deleteAllSessions(): void {
    localStorage.setItem('alias', '[]');      // Pone arreglo nuevo
  }
  /* --------------------------------------- */

  /** Subscripción de cambio en estatus de sesión */
  onSessionChange(): Observable<any> {
    return fromEvent(window, 'storage')  // Evento de localStorage
      .pipe(
        filter((event: any) => (event.key === 'alias')), // Filtra solo si hay cambio en 'alias'
        filter((event: StorageEvent) => (event.newValue !== event.oldValue)),
        map( event => this.getSessionStatus() )
      );
  }
  /* --------------------------------------- */
}
