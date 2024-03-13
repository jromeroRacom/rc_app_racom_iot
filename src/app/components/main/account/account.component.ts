import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subscription, Subject, timer } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ConfirmDialogComponent } from '../../shared/dialogs/confirm-dialog/confirm-dialog.component';

import { ErrorsModel, ResponseModel } from '../../../global/models/back-end.models';
import { AuthFormUtils } from '../../../global/helpers/auth-form.helpers';

import { RightSidebarService } from '../../../core/service/rightsidebar.service';
import { AuthTokenService } from '../../../global/services/auth-token.service';
import { LoadingDialogService } from '../../../global/services/loading-dialog.service';
import { EventsSessionService, SessionEvent } from '../../../global/services/events-session.service';
import { SnackBarService } from '../../../global/services/snack-bar.service';
import { takeUntil } from 'rxjs/operators';
import { MainService } from '../main.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountDialogComponent } from './dialogs/account-dialog/account-dialog.component';
import { DeleteAccountComponent } from './dialogs/delete-account/delete-account.component';
import { NavigationService } from '../../../global/services/navigation.service';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {

  // Form 1
  public accountForm!: UntypedFormGroup;
  public hide = true;                                        // Ocultar contraseña actual
  public chide = true;                                       // Ocultar contraseña nueva
  public flagEditPass = false;                               // Flag para saber si se modifica pass
  public flagEditEmail = false;                               // Flag para saber si se modifica email
  public selectedBgColor: string;                            // Color de fondo de cuenta
  public skinColor$!: Subscription;                          // Subscripción para observable de color
  public listErrors = new ErrorsModel();                     // Lista de errores
  public listErrors2 = new ErrorsModel();                     // Lista de errores

  public formValidators = new AuthFormUtils();               // Funciones de formulario
  private destroy$ = new Subject();                          // Observable para acciones de destroy
  private dialogRef!: MatDialogRef<ConfirmDialogComponent>;  // Referencia para dialog de eventos

   /** Constructor */
  constructor(
    private formBuilder: UntypedFormBuilder,                     // Creador de formularios
    public dialog: MatDialog,                             // Para uso de Dialogs
    private rightSide: RightSidebarService,               // Servicio de menu derecho
    public snack: SnackBarService,                        // Servicio de snack bar personalizado
    private loading: LoadingDialogService,                // Servicio de dialog loaging personalizado
    private authToken: AuthTokenService,                  // Servicio de token
    private sessionEventsService: EventsSessionService,   // Servicio para eventos de sesión
    private router: Router,                               // Manejo de rutas
    private mainService: MainService,                     // Servicio de auth
    private navigation: NavigationService                 // Servicio de navegacion
  ) {
    this.selectedBgColor = 'l-bg-grey-dark';              // Color inicial
  }
  /* --------------------------------------- */

  /** Ciclo de vide de Inicio */
  ngOnInit(): void {
    this.createAccountForm();                     // Inicializa formulario
    this.setUserCategoryValidators();    // Validadores condicionales
    this.setInitialColors();             // Color inicial de fondo
  }
  /* --------------------------------------- */

  /** Ciclo de vide de Final */
  ngOnDestroy(): void {
    if (this.skinColor$){this.skinColor$.unsubscribe(); }  // Elimina subscripción
    this.destroy$.next();     // Dispara Observable
    this.destroy$.complete(); // Finaliza Observable
  }
  /* --------------------------------------- */

  /******************* Acciones de formulario ***************************/
  /** Crea formulario de cuenta */
  createAccountForm(): void {
    const nameToken = this.authToken.getUserNameFromToken();  // Obtiene nombre de token
    const emailToken = this.authToken.getEmailFromToken();    // Obtiene correo de token

    this.accountForm = this.formBuilder.group({
      name: [nameToken, [Validators.required, Validators.maxLength(50), Validators.minLength(2), Validators.pattern('^[a-z0-9A-ZÀ-ÿ\u00f1\u00d1 ]+(\s*[a-z0-9A-ZÀ-ÿ\u00f1\u00d1]*)*[a-z0-9A-ZÀ-ÿ\u00f1\u00d1]+$')]],
      email: [{ value: emailToken, disabled: true }, [Validators.required, Validators.maxLength(50), Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(50), Validators.minLength(6)]],
      passwordNew: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(50), Validators.minLength(6)]],
      passwordNew2: [{ value: '', disabled: true }, [Validators.required]],
      showPass: [this.flagEditPass],
      showEmail: [this.flagEditEmail]
    }, {
      validators: this.formValidators.validatorPasswords('passwordNew', 'passwordNew2')
    });

    this.formValidators.initFormGroup(this.accountForm);     // Inicializa utilidades de formulario
  }
  /* --------------------------------------- */

  /** Al presionar submit */
  onSubmit(): void {
    this.confirmChanges();          // Dispara dialog de confirmación
  }
  /* --------------------------------------- */

  /** Dispara dialog para confirmar cambios */
  private confirmChanges(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {  // Dialog de confirmación
      maxWidth: '455px',
      data: {
        title: '¿Estás Seguro?',
        text: 'Se actualizarán los datos de tu cuenta. En algunos casos tendras que volver a iniciar sesión',
        type: 'primary'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {     // Al cerrarse
      if (result === 1) {                               // Si se acepto
        this.loading.show();                            // Muestra loading
        if (this.checkValidForm()){                     // Si es valido el formulario
          this.doAcountUpdate();                        // Hace logica de cuenta
        }
      }
    });
  }
  /* --------------------------------------- */

  /** Checa si el formulario es valido */
  private checkValidForm(): boolean {
    if (!this.formValidators.isFormValid) {     // Si no es valido
      this.loading.close();                     // Cierra loading
      this.listErrors.errors = [{              // Mensaje de error
        msg: 'Campos incorrectos por favor verifica los datos ingresados'
      }];
      this.formValidators.formMarkAsTouched();  // Marca campos como marcados
      return false;                              // Retorna falso
    } else { return true; }                      // Retorna verdadero
  }
  /* --------------------------------------- */

  /** Lógica de cambio en cuenta */
  private doAcountUpdate(): void {
    const email = this.formValidators.getFormValue('email');          // Obtiene email
    const name =  this.formValidators.getFormValue('name').trim();    // Obtiene nombre
    const pass =  this.formValidators.getFormValue('password');       // Obtiene contraseña
    const passN =  this.formValidators.getFormValue('passwordNew');   // Obtiene contraseña nueva

    this.listErrors.errors = [];                   // Limpia errores.

    this.mainService.userDataUpdate(name, email, pass, passN).pipe(takeUntil(this.destroy$)).subscribe(  // Petición a actualizacion
      (data: ResponseModel) => {                             // Recepción correcta
        this.loading.close();                                // Cierra el Loading
        this.logicAccountDialog(name, email, passN);   // Hace logica de dialog
      },
      (err: HttpErrorResponse) => {
        this.loading.close();                                     // Cierra el Loading
        this.snack.show('danger', 'Error', 'top', 'rigth');       // Muestra notificación de error
        this.listErrors = err.error;                              // Pone errores para mostrar
      }
    );
  }
  /* --------------------------------------- */

  /** Hace logica de dialog */
  private logicAccountDialog(name: string, email: string, npass: string ): void{

    const flagNameChange = name !== this.authToken.getUserNameFromToken();  // Flag de cambio de nombre
    const flagEmailChange = email !== this.authToken.getEmailFromToken();   // Flag de cambio de email
    const flagPassChange =  npass !== '' ;                                  // Flag de cambio de contraseña

    if (flagNameChange || flagEmailChange || flagPassChange){      // Si hubo algún cambio
      const dialogRef = this.dialog.open(AccountDialogComponent, {  // Dialog de confirmación
        maxWidth: '455px',
        data: { newEmail: flagEmailChange, email }
      });

      dialogRef.afterClosed().subscribe((result) => {     // Al cerrarse
        const dataEvent = new SessionEvent();             // Evento d ecambio para iniciar de nuevo sesión
        dataEvent.type = 'change';
        this.sessionEventsService.addSessionEvent(dataEvent);
        this.router.navigate(['/auth/signin']);               // Redirecciona a login
      });
    }else{
      this.snack.show('success', 'Ningún cambio', 'top', 'right'); // Muestra snack de correcto
    }
  }
  /* --------------------------------------- */

  /** Hace logica de dialog */
  private triggerDeleteDialog(code: string ): Promise<any>{
    const promise = new Promise((resolve, reject) => {

      const dialogRef = this.dialog.open(DeleteAccountComponent, {  // Dialog de confirmación
        maxWidth: '455px',
        data: { code }
      });

      dialogRef.afterClosed().subscribe((result: UntypedFormGroup) => {     // Al cerrarse
        if (result){
          if (!result.invalid){
            resolve ({password: result.get('password')?.value }) ;
          }
          reject();
        }
        resolve({password: '' });
      });
    });
    return promise;
  }
  /* --------------------------------------- */

  /** Obtiene color inicial de fondo */
  private setInitialColors(): void {                // Establece estado inicial de skin
    // Skins
    if (localStorage.getItem('choose_skin_active')) {   // Busca en local storage si esta el skin
      this.selectedBgColor = 'bg-' + localStorage.getItem('choose_skin_active');  // Obtiene el color activo
    } else {
      this.selectedBgColor = 'bg-grey';
    }

    this.skinColor$ = this.rightSide.onSkinChange().subscribe((color) => {
      if (color === 'white') { this.selectedBgColor = 'bg-grey'; }
      else { this.selectedBgColor = 'bg-' + color; }
    });

  }
  /* --------------------------------------- */

 /** Lógica para habilitar o deshabilitar cambos sin cambio */
  setUserCategoryValidators(): void {
    const email = this.accountForm.get('email') ;
    const pass = this.accountForm.get('password') ;
    const passNew = this.accountForm.get('passwordNew');
    const passNew2 = this.accountForm.get('passwordNew2');

    this.accountForm.get('showEmail')?.valueChanges
      .subscribe(showEmail => {
        const emailToken = this.authToken.getEmailFromToken();    // Obtiene correo de token

        if (showEmail){
          this.flagEditEmail = true;
          pass?.setValidators([Validators.required, Validators.maxLength(50), Validators.minLength(6)]);
          email?.setValidators([
            Validators.required, Validators.maxLength(50),
            Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]);
          email?.setValue(emailToken); email?.enable(); pass?.enable();
        }else{
          this.flagEditEmail = false;
          email?.setValidators(null);
          email?.setValue(emailToken); email?.disable();
          email?.markAsUntouched();
          if (!this.flagEditPass){
            pass?.setValue(''); pass?.disable();
            pass?.setValidators(null);
            pass?.markAsUntouched();
          }
        }
        pass?.updateValueAndValidity();
        email?.updateValueAndValidity();
      });

    this.accountForm.get('showPass')?.valueChanges
      .subscribe(showPass => {
        if (showPass === true) {
          this.flagEditPass = true;
          pass?.setValidators([Validators.required, Validators.maxLength(50), Validators.minLength(6)]);
          passNew?.setValidators([Validators.required, Validators.maxLength(50), Validators.minLength(6)]);
          passNew2?.setValidators([Validators.required]);

          pass?.enable(); passNew?.enable(); passNew2?.enable();
        } else {
          this.flagEditPass = false;
          passNew?.setValidators(null);
          passNew2?.setValidators(null);
          passNew?.setValue(''); passNew?.disable();
          passNew2?.setValue(''); passNew2?.disable();
          passNew?.markAsUntouched();
          passNew2?.markAsUntouched();

          if (!this.flagEditEmail){
            pass?.setValue(''); pass?.disable();
            pass?.setValidators(null);
            pass?.markAsUntouched();
          }
        }

        pass?.updateValueAndValidity();
        passNew?.updateValueAndValidity();
        passNew2?.updateValueAndValidity();
      });
  }
  /* --------------------------------------- */

  /** Logíca para borrar dispositivos de usuario */
  deleteDevices(): void {
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {  // Configuracion para dialog
      maxWidth: '355px',
      data: {
        title: '¿Estás Seguro?',
        text: 'Esta acción borarrá todos los dispositivos vinculados a su cuenta',
        type: 'warn'
      }
    });

    this.dialogRef.afterClosed().subscribe(async (result) => {
      if (result === 1) {
        try {
          const {password} = await this.triggerDeleteDialog('borrar-dispositivos');
          if (password){
            this.listErrors2.errors = [];
            this.loading.show();
            this.mainService.userDeleteAllDevices(password).pipe(takeUntil(this.destroy$)).subscribe(  // Petición a login
              (data: ResponseModel) => {                             // Recepción correcta
                this.loading.close();                                // Cierra el Loading
                this.snack.show('success', 'Borrados correctamente', 'top', 'right'); // Muestra snack de correcto
              },
              (err: HttpErrorResponse) => {
                this.loading.close();                                     // Cierra el Loading
                this.snack.show('danger', 'Error', 'top', 'rigth');       // Muestra notificación de error
                this.listErrors2 = err.error;                              // Pone errores para mostrar
              }
            );
          }
        } catch (error) {
          this.snack.show('danger', 'Error al borrar dispositicos', 'top', 'center');
        }
      }
    });
  }
  /* --------------------------------------- */

  /** Lógica para deshabilitar cuenta */
  deleteAcount(): void {
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {  // Dialog de confirmación
      maxWidth: '355px',
      data: {
        title: '¿Estás Seguro?',
        text: `Esta acción deshabilitará su cuenta por completo.
        Para revertir la acción se debe solicitar al equipo de Racom`,
        type: 'warn'
      }
    });

    this.dialogRef.afterClosed().subscribe(async (result) => {          // Al cerrarse dialog de confirmacion
      if (result === 1) {
        try {
          const {password} = await this.triggerDeleteDialog('borrar-cuenta');  // Dispara dialog de borrar
          if (password){                                                       // Si retorna password
            this.listErrors2.errors = [];                                      // Limpia errores
            this.loading.show();                                               // Muestra loading
            this.mainService.userDisableAccount(password)  // Petición desabilitar usuario
             .pipe(takeUntil(this.destroy$))
             .subscribe(
              (data: ResponseModel) => {                             // Recepción correcta
                this.loading.close();                                // Cierra el Loading
                this.snack.show('success', 'Cuenta deshabilitada correctamente', 'top', 'right'); // Muestra snack de correcto
                const dataEvent = new SessionEvent();    // Evento de disable user
                dataEvent.type = 'disable-user';
                this.sessionEventsService.addSessionEvent(dataEvent);
                timer(1500).subscribe(val => this.router.navigate(['/auth/signin']));  // Disecciona a login
              },
              (err: HttpErrorResponse) => {
                this.loading.close();                                     // Cierra el Loading
                this.snack.show('danger', 'Error', 'top', 'rigth');       // Muestra notificación de error
                this.listErrors2 = err.error;                              // Pone errores para mostrar
              }
            );
          }
        } catch (error) {
          this.snack.show('danger', 'Error al borrar dispositicos', 'top', 'center');  // Error en el dialog de borrar
        }
      }
    });
  }
  /* --------------------------------------- */

  backClicked(): void {
    this.navigation.back();
  }
}
