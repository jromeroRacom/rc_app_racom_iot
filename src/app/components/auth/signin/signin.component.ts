import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { EventDialogComponent } from './dialogs/event-dialog/event-dialog.component';

import { ErrorsModel, ResponseModel } from 'src/app/global/models/back-end.models';

import { AuthService } from '../auth.service';
import { SnackBarService } from '../../../global/services/snack-bar.service';
import { AuthFormUtils } from '../../../global/helpers/auth-form.helpers';
import { LoadingDialogService } from '../../../global/services/loading-dialog.service';
import { EventsSessionService } from '../../../global/services/events-session.service';
import { TabSessionService } from '../../../global/services/tab-session.service';
import { AuthTokenService } from '../../../global/services/auth-token.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit, OnDestroy {
  loginForm!: UntypedFormGroup; // Formulario reactivo
  rememberUser: boolean; // Flag para obtener recordarme
  listErrors = new ErrorsModel(); // Lista de errores
  private dialogRef!: MatDialogRef<EventDialogComponent>; // Referencia para dialog de eventos
  public formValidators = new AuthFormUtils(); // Funciones de formulario
  private destroy$ = new Subject();             // Observable para acciones de destroy

  /** Constructor */
  constructor(
    private formBuilder: UntypedFormBuilder, // Creador de formularios
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog, // Para uso de Dialogs
    public snack: SnackBarService, // Servicio de snack bar personalizado
    private loading: LoadingDialogService, // Servicio de dialog loaging personalizado
    private authService: AuthService, // Servicio de auth
    private sessionEventsService: EventsSessionService,  // Servicio de eventos de sesión
    private sessionTab: TabSessionService,               // Servicio de sesion por tab
    private authToken: AuthTokenService                  // Servicio de token
  )
  {
    this.rememberUser = false; // Inicializa recordarme con falso
  }
  /* --------------------------------------- */

  /** Lifecycle Inicio */
  ngOnInit(): void {
    this.createLoginForm(); // Crea formulario reactivo de login
    this.logoutStuff(); // Lógica de logout si es necesario
    this.checkSessionEvents(); // Checa eventos de sesión
    this.storageInitData(); // Inicializa valores guardados en local storage
  }
  /* --------------------------------------- */

  /** Lifecycle Final */
  ngOnDestroy(): void {
    this.destroy$.next();     // Dispara Observable
    this.destroy$.complete(); // Finaliza Observable
  }
  /* --------------------------------------- */


  /******************* Acciones de formulario ***************************/

  /** Crea formulario reactivo de login */
  private createLoginForm(): void {
    this.loginForm = this.formBuilder.group({    // Crea grupo de formulario
      email: ['',                                                      // Campo de email
        [ Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],  // Campo de contraseña
      check: [false]                                                   // Campo de recordarme
    });
    this.formValidators.initFormGroup(this.loginForm);     // Inicializa utilidades de formulario
  }
  /* --------------------------------------- */

  /** Acciones al submit */
  onSubmit(): void {
    this.loading.show();                           // Muestra dialog de loading
    if (this.checkValidForm()){ this.doLogin(); }  // Si es valido hace logica de login
  }
  /* --------------------------------------- */

  /** Checa si el formulario es valido */
  private checkValidForm(): boolean {
    if (!this.formValidators.isFormValid) {     // Si no es valido
      this.loading.close();                      // Cierra loading
      this.listErrors.errors = [{              // Mensaje de error
        msg: 'Campos incorrectos por favor verifica los datos ingresados'
      }];
      this.formValidators.formMarkAsTouched();  // Marca campos como marcados
      return false;                              // Retorna falso
    } else { return true; }                      // Retorna verdadero
  }
  /* --------------------------------------- */

  /** Inicializa valores guardados en local storage */
  private storageInitData(): void {
    if (localStorage.getItem('email')) {     // Si existe email en local storage
      this.rememberUser = true;              // Establece recordarme con true
      this.loginForm.reset({                 // Pone recordarme y correo en formulario
        email: localStorage.getItem('email'),
        check: true
      });
    }
  }
  /* --------------------------------------- */


  /** Lógica de login */
  private doLogin(): any {
    const email = this.formValidators.getFormValue('email') || '';     // Obtiene correo de formulario
    const pass = this.formValidators.getFormValue('password') || '';   // Obtiene contraseña de formulario
    const check = this.formValidators.getFormValue('check') || false;  // Obtiene recordarme de formulario

    this.authService.login(email, pass).pipe(takeUntil(this.destroy$)).subscribe(  // Petición a login
      (data: ResponseModel) => {                             // Recepción correcta
        this.loading.close();                                // Cierra el Loading
        if (check){localStorage.setItem('email', email); }   // Pone email en local storage
        else {localStorage.setItem('email', ''); }            // Borra email de local storage
        localStorage.setItem('token', data.token || 'none'); // Pone token en local storage
        this.loginForm.reset();                              // Resetea login para borrar contraseña
        this.snack.show('success', 'Ingreso Correcto', 'top', 'right'); // Muestra snack de correcto

        this.router.navigateByUrl('/app/home');                         // Navega al Home
      },
      (err: HttpErrorResponse) => {
        this.loading.close();                                     // Cierra el Loading
        this.snack.show('danger', 'Error', 'top', 'rigth');       // Muestra notificación de error
        this.listErrors = err.error || '{ok:false,errors:[{msg: Error Inesperado}]}'; // Pone errores para mostrar
      }
    );
  }
  /* --------------------------------------- */

  /******************* Acciones de Sesión ***************************/

  /** Lógica de logout si es necesario */
  private logoutStuff(): void {
    this.sessionTab.deleteAllSessions();                                     // Borra sesiones Tab
    if (!this.authToken.isTokenExpired()) {                                  // Si el token aun no expira
      this.authService.logout().pipe(takeUntil(this.destroy$)).subscribe();  // Logout en servidor
    }
    this.authToken.deleteToken();                                            // Borra token de sesion
  }
  /* --------------------------------------- */

  /** Checa eventos de sesión */
  private checkSessionEvents(): void {
    this.dialog.closeAll();
    const event = this.sessionEventsService.getFirstSessionEvent();  // Obtiene evento de servicio
    if (event.type !== 'none') {                                // Si hay algún evento
      this.openEventDialog(event.type);                         // Dispara dialog de evento
    }
  }
  /* --------------------------------------- */
  /******************************************************************/

  /******************* Acciones de dialogs ***************************/

  /** Muestra dialog de eventos de sesión  */
  openEventDialog(event: string): void {
    let msgEvent: string;      // Mensaje de evento
    let iconEvent: string;     // Icono de evento

    switch (event) {      // Analiza que tipo de evento se disparó
      case 'idle':
        msgEvent = 'Expiró el tiempo de inactividad en el sistema';
        iconEvent = 'fas fa-bed';
        break;
      case 'expired':
        msgEvent = 'Expiró el tiempo de sesión activa en el sistema';
        iconEvent = 'fas fa-clock';
        break;
      case '401':
        msgEvent = 'El usuario no está autorizado o no tiene una sesión activa. Por favor inicie sesión nuevamente';
        iconEvent = 'fas fa-key';
        break;
      case 'change':
        msgEvent = `Es necesario iniciar sesión nuevamente con los cambios realizados. Si se
         realizó un cambio de correo, es necesario validarlo primero con el enlace enviado`;
        iconEvent = 'far fa-user-circle';
        break;
      case 'token-deleted':
        msgEvent =
          'El token de sessión fue borrado, es necesario para mantener una sesión activa';
        iconEvent = 'fas fa-key';
        break;
      case 'alias-error':
        msgEvent =
          'Ocurrió un error con el manejador de los alias, es necesario para mantener una sesión activa';
        iconEvent = 'fas fa-user-tag';
        break;
      case 'disable-user':
        msgEvent =
          'Su cuenta ha sido deshabilitada. Si necesita ayuda contactenos';
        iconEvent = 'fas fa-ban';
        break;
      default:
        msgEvent = `Ocurrio un error interno (${event})`;
        iconEvent = 'far fa-dizzy';
        break;
    }

    this.dialogRef = this.dialog.open(EventDialogComponent, {  // Abre dialog de eventos
      data: { msg: msgEvent, icon: iconEvent },
      maxWidth: '355px'
    });

    this.dialogRef.afterClosed().subscribe((result) => {    // Borra los eventos de servicio
      this.sessionEventsService.deleteSessionEvents();
    });
  }
  /* --------------------------------------- */
}
