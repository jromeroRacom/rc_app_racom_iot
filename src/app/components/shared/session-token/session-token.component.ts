import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, merge, interval } from 'rxjs';
import { take, timeout } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ExpirationEvent } from '../../../global/models/auth-token.models';

import { ExpiredSessionDialogComponent } from './dialogs/expired-session-dialog/expired-session-dialog.component';

import {
  EventsSessionService,
  SessionEvent
} from '../../../global/services/events-session.service';
import { AuthTokenService } from '../../../global/services/auth-token.service';

@Component({
  selector: 'app-session-token',
  template: ''
})
export class SessionTokenComponent implements OnInit, OnDestroy {
  expirationEvent$!: Subscription;                                 // Observable para expiraxion de token
  sessionEventData = new SessionEvent();                           // Variable para evento de sesión
  private dialogRef!: MatDialogRef<ExpiredSessionDialogComponent>; // Referencia para dialog de expiración
  secondsLeft: number;                                             // Variable segundos faltantes para expirar
  /** Constructor */
  constructor(
    private router: Router,                            // Para uso de rutas
    public dialog: MatDialog,                          // Para uso de Dialogs
    private authService: AuthTokenService,             // Servicio de token
    private sessionEventsService: EventsSessionService // Servicio para eventos de sesión
  ) {
    this.sessionEventData.origin = 'session-token'; // Pone origen de evento de sesión
    this.secondsLeft = 15;                          // Inicializa segundos faltantes para expirar

    if( this.authService.getToken()){
      this.expirationEvent$ = merge(                  // Observable que Combina eventos de token
        this.authService.onTokenExpired(),            // Token expirado
        this.authService.onTokenAlmostExpired(),      // Token casi expirado
        this.authService.onTokenDeleted()             // Token borrado
      ).subscribe((event) => this.doSesionLogic(event));   // Realiza logica de sesión por token
    }
  }
  /* --------------------------------------- */

  /** Ciclo de vida  Inicio  */
  ngOnInit(): void {}
  /* --------------------------------------- */

  /** Ciclo de vida  Fin  */
  ngOnDestroy(): void {
    this.deleteEvents();     // Elimina las subscripciones
  }
  /* --------------------------------------- */

  /** Elimina las subscripciones */
  deleteEvents(): void {
    if (this.expirationEvent$) {           // Borra subcripción de evento expiracion si existe
      this.expirationEvent$.unsubscribe();
    }
  }
  /* --------------------------------------- */

  /**
   * Realiza logica de sesión por token
   * @param event Tipo de evento de token disparado
   */
  private doSesionLogic(event: ExpirationEvent): void {
    if (event.event === 'almost') {                // Evento de casi expirado
      this.doDialogLogic(event.timeLeft || 15);    // Hace logica de dialog de token
    } else if (event.event === 'expired') {        // Evento de expirado
      this.dialog.closeAll();                      // Cierra dialog de token
      this.setEvent('expired');                    // Pone evento de sesión como expirado
      this.router.navigate(['/auth/signin']);      // Direcciona a login
    } else if (event.event === 'deleted') {        // Evento de token borrado
      this.dialog.closeAll();                      // Cierra dialogs abiertos
      this.setEvent('token-deleted');              // Pone evento de sesión con token borrado
      this.router.navigate(['/auth/signin']);      // Direcciona a login
    }
  }
  /* --------------------------------------- */

  /**
   * Realiza logica de dialog de token
   * @param timeLeft tiempo para que sesión expire
   */
  doDialogLogic(timeLeft: number): void {
    this.secondsLeft = Math.round(timeLeft / 1000);  // Redondea segundos
    this.openDialog(this.secondsLeft);               // Abre dialog de token

    interval(1000)                        // Intervalo de 1 segundo para cuenta regresiva
      .pipe(take(this.secondsLeft + 1))   // Inicia con segunod más 1 para detectar el 0
      .subscribe((count) => {
        this.countDialog(count + 1);      // Realiza conteo en dialog
      });
  }
  /* --------------------------------------- */

  /**
   * Abre dialog de token
   * @param value número para expiración de token
   */
  openDialog(value: number): void {
    this.dialogRef = this.dialog.open(ExpiredSessionDialogComponent, {  // Dispara dialog
      maxWidth: '355px',
      data: { count: value }
    });

    this.dialogRef.afterClosed().subscribe((result) => {  // Al cerrarse
      if (result === 1) {                                 // Si se presiono el boton
        this.dialogRef.close();                           // Cierra dialog de token
        this.setEvent('expired');                         // Pone evento de expirado
        this.router.navigate(['/auth/signin']);           // Direcciona a login
      }
    });
  }
  /* --------------------------------------- */

  /**
   * Realiza lógica de conteo regresivo en dialog de token
   * @param count cuenta actual
   */
  countDialog(count: number): void {
    if (this.dialogRef && this.dialogRef.componentInstance) {  // Manda datos a dialog
      this.dialogRef.componentInstance.data = {
        count: this.secondsLeft - count       // Conteo regresivo
      };
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
