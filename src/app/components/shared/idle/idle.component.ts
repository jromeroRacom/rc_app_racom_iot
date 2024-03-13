import { Component, Input, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fromEvent, Observable, merge, Subscription } from 'rxjs';

import { IdleDialogComponent } from './dialogs/idle-dialog/idle-dialog.component';

import { UserIdleConfig, UserIdleService } from 'angular-user-idle';
import { EventsSessionService, SessionEvent } from '../../../global/services/events-session.service';

@Component({
  selector: 'app-idle',
  template: ''
})
export class IdleComponent implements OnInit, OnDestroy {
  private idleEvents: Array<any>[] = [   // Eventos a escuchar para inactividad
    [document, 'click'],
    [document, 'wheel'],
    [document, 'scroll'],
    [document, 'mousemove'],
    [document, 'keyup'],
    [window, 'resize'],
    [window, 'scroll'],
    [window, 'mousemove']
  ];

  @Input() cIdle!: number;                                 // Tiempo de idle
  @Input() cTimeout!: number;                              // Tiempo de timeout
  private dialogRef!: MatDialogRef<IdleDialogComponent>;   // Referencia para abrir dialog de idle
  onTimerStart$!: Subscription;                            // Observable para inicio de timer
  onTimeout$!: Subscription;                               // Observable para timeout

  /** Constructor */
  constructor(
    private router: Router,                               // Uso de routing
    public dialog: MatDialog,                             // Para uso de Dialogs
    private userIdle: UserIdleService,                    // Servicio de Idle
    private sessionEventsService: EventsSessionService,   // Servicio de eventos de sesión
  ) {
    const observableArray$: Observable<any>[] = []; // Crea arreglo de observables
    this.idleEvents.forEach((x) => {                // Crea arreglos de observables fromEvent
      observableArray$.push(fromEvent(x[0], x[1]));
    });
    this.userIdle.setCustomActivityEvents(merge(...observableArray$));  // Establece eventos para evitar idle
  }
  /* --------------------------------------- */

  /** Ciclo de vida  Inicio  */
  ngOnInit(): void {
    this.initObservables();    // Inicializa observables
  }
  /* --------------------------------------- */

   /** Ciclo de vida  Final  */
  ngOnDestroy(): void {
    this.userIdle.stopWatching();     // Detiene servicio de idle
    this.deleteSubscriptions();       // Borra las subscripciones
  }
  /* --------------------------------------- */

  /** Inicializa observables */
  private initObservables(): void {
    const config: UserIdleConfig = {};             // Objeto de configuración
    config.idle = Number(this.cIdle) || 600;       // Default 10 min
    config.timeout = Number(this.cTimeout) || 15;  // Default 15 segundos
    config.idleSensitivity = 1;                    // Sencibilidad de idle
    config.ping = 120;                             // Ping de idle

    this.deleteSubscriptions();                   // Borra subcripciones si existen
    this.userIdle.stopWatching();                 // Detiene idle si está activo
    this.userIdle.setConfigValues(config);        // Establece configuración de idle

    this.userIdle.startWatching();                // Comienza servicio de idle
    this.onTimerStart$ = this.userIdle.onTimerStart().subscribe((count) => {  // Observable de idle
      this.logicDialog(count);                                // Lógica de dialog de idle
    });
    this.onTimeout$ = this.userIdle          // Observable de timeout
      .onTimeout()
      .subscribe(() => this.closeSession());  // Cierra sesión
  }
  /* --------------------------------------- */

  /**
   * Lógica de dialog de idle
   * @param count conteo actual antes de cerrar
   */
  logicDialog(count: number): void {
    if (count === 1) {             // Si es la primera vez dispara dialog
      this.openDialog();           // Dispara dialog
    } else {
      if (this.dialogRef && this.dialogRef.componentInstance) {  // Hace conteo desendente en dialog
        this.dialogRef.componentInstance.data = {                // Envia datos a dialog
          count: this.cTimeout - count
        };
      }
    }
  }
  /* --------------------------------------- */

  /** Dispara dialog de idle */
  openDialog(): void {
    this.dialogRef = this.dialog.open(IdleDialogComponent, {   // Dispara dialog de idle
      maxWidth: '355px',
      data: { count: this.cTimeout }                           // Conteo regresivo
    });

    this.dialogRef.afterClosed().subscribe((result) => {   // Al cerrarse
      if (result === 1) {                                  // Si se presionó el boton
        this.dialogRef.close();                            // Cierra dialog de idle
        this.userIdle.resetTimer();                        // Resetea timer de idle
      }
    });
  }
  /* --------------------------------------- */

  /** Cierra sesión por idle */
  closeSession(): void {
    this.dialogRef.close();              // Cierra dialog de idle
    this.deleteSubscriptions();          // Borra subcripciones
    this.userIdle.stopWatching();        // Detiene idle

    const data = new SessionEvent();     // Nuevo evento
    data.type = 'idle';                  // De tipo idle
    data.origin = 'idle.component';      // Origen de evento
    this.sessionEventsService.addSessionEvent(data);  // Agrega evento de sesión
    this.router.navigate(['/auth/signin']);           // Dirije a login
  }
  /* --------------------------------------- */

  /** Borra subcripciones */
  deleteSubscriptions(): void {
    if (this.onTimeout$) {           // Si existe observable de idle
      this.onTimeout$.unsubscribe(); // Borra subscripción
    }
    if (this.onTimerStart$) {           // Si existe observable de timeout
      this.onTimerStart$.unsubscribe(); // Borra subscripción
    }
  }
  /* --------------------------------------- */
}
