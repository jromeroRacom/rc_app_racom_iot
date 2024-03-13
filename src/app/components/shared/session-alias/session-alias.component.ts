import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { EventsSessionService, SessionEvent} from '../../../global/services/events-session.service';
import { TabSessionService } from '../../../global/services/tab-session.service';

@Component({
  selector: 'app-session-alias',
  template: ''
})
export class SessionAliasComponent implements OnInit, OnDestroy {
  tabId: string;                           // ID de tab
  tabStatus: string;                       // Estatus de tab
  tabIdChange$!: Subscription;             // Observable para cambio en estatus de tab
  sessionEventData = new SessionEvent();   // Variable para eventos de sesión

  /** Constructor */
  constructor(
    private router: Router,                              // Manejo de rutas
    private sessionTab: TabSessionService,               // Servicio de Sesion de tab
    private sessionEventsService: EventsSessionService,  // Servicio de eventos de sesión
  ) {
    this.sessionEventData.origin = 'session-alias';      // Pone origen de evento de sesión
    this.tabId = '1111';              // Inicializa tab id
    this.tabStatus = 'none';          // Inicializa estatus de tab
  }
  /* --------------------------------------- */

  /** Ciclo de vida  Inicio  */
  ngOnInit(): void {
    this.sessionTabLogic();      // Inicializa logica de sesion de tab
  }
  /* --------------------------------------- */

  /** Ciclo de vida  Fin  */
  ngOnDestroy(): void {
    if ( this.tabIdChange$){ this.tabIdChange$.unsubscribe(); } // Si existe elimina observable de cambios de estatus
    this.sessionTab.deleteSesion();                             // Elimina sesión id
  }
  /* --------------------------------------- */

  /** Inicializa logica de sesion de tab */
  private sessionTabLogic(): void {
    this.tabId = this.sessionTab.getSessionId();                    // Obtiene ID de sesión
    this.doSessionChangeLogic(this.sessionTab.getSessionStatus());  // Lógica de cambio de estatus
    this.tabIdChange$ = this.sessionTab.onSessionChange()
      .subscribe((status) => { this.doSessionChangeLogic(status); });   // Observable a cambios de estatus
  }
   /* --------------------------------------- */

  /**
   * Lógica para cuando cambia estatus de tab
   * @param status Nuevo estatus
   */
  private doSessionChangeLogic(status: string): void {
    this.tabStatus = status;                  // Obtiene nuevo estatus

    if (this.tabStatus === 'error') {         // Si es error
      this.setEvent('alias-error');           // Pone evento de error
      this.router.navigate(['/auth/signin']); // Sale de sesión
    }

    if (this.tabStatus === 'child') {            // Si es child
      this.router.navigate(['/auth/page-wait']); // Sale a pantala de espera
    }
  }
   /* --------------------------------------- */

   /**
    * Agrega evento de sesión
    * @param type Evento a agregar
    */
  setEvent(type: string): void {
    this.sessionEventData.type = type;
    this.sessionEventData.timestamp = new Date();
    this.sessionEventsService.addSessionEvent(this.sessionEventData);
  }
   /* --------------------------------------- */
}
