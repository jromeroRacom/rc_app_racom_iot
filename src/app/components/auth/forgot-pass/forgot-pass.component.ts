import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import {
  ErrorsModel,
  ResponseModel
} from 'src/app/global/models/back-end.models';
import { AuthService } from '../auth.service';
import { SnackBarService } from '../../../global/services/snack-bar.service';
import { AuthFormUtils } from '../../../global/helpers/auth-form.helpers';
import { LoadingDialogService } from '../../../global/services/loading-dialog.service';
import { ForgotPassDialogComponent } from './dialogs/forgot-pass-dialog/forgot-pass-dialog.component';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss']
})
export class ForgotPassComponent implements OnInit, OnDestroy {
  passForm!: UntypedFormGroup;                           // Formulario reactivo
  public listErrors = new ErrorsModel();          // Lista de errores
  public formValidators = new AuthFormUtils();    // Funciones de formulario
  private destroy$ = new Subject();               // Observable para acciones de destroy
  private dialogRef!: MatDialogRef<ForgotPassDialogComponent>; // Referencia para dialog de correcto

  submitted = false;

  /** Constructor */
  constructor(
    private formBuilder: UntypedFormBuilder,      // Creador de formularios
    private router: Router,                // Manejo de rutas
    public dialog: MatDialog,              // Para uso de Dialogs
    public snack: SnackBarService,         // Servicio de snack bar personalizado
    private loading: LoadingDialogService, // Servicio de dialog loaging personalizado
    private authService: AuthService       // Servicio de auth
  ) {}
  /* --------------------------------------- */

  /** Ciclo de vide de Inicio */
  ngOnInit(): void {
    this.createPassResetForm();            // Crea formulario reactivo
  }
  /* --------------------------------------- */

  /** Ciclo de vide de Final */
  ngOnDestroy(): void {
    this.destroy$.next();     // Dispara Observable
    this.destroy$.complete(); // Finaliza Observable
  }
  /* --------------------------------------- */


  /******************* Acciones de formulario ***************************/

  /** Crea formulario reactivo de reestablece constraseña */
  private createPassResetForm(): void {
    this.passForm = this.formBuilder.group({
      email: ['', [Validators.required,Validators.maxLength(50),Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]
      ]
    });
    this.formValidators.initFormGroup(this.passForm);     // Inicializa utilidades de formulario
  }
  /* --------------------------------------- */

  /** Al presionar submit */
  onSubmit(): void {
    this.loading.show();
    if (this.checkValidForm()){ this.doPassReset(); }  // Si es valido hace logica de registrar
    this.checkValidForm();
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

  /** Logica de resetear pass */
  private doPassReset(): void {
    const email = this.formValidators.getFormValue('email');        // Obtiene email

    this.authService.getPassReset( email).pipe(takeUntil(this.destroy$)).subscribe(  // Petición a login
      (data: ResponseModel) => {                             // Recepción correcta
        this.submitted = true;
        this.loading.close();                                // Cierra el Loading
        this.snack.show('success', 'Se ha enviado un correo para validar cuenta', 'top', 'right'); // Muestra snack de correcto
        this.triggerResetPassDialog( email);    // Abre dialog de correcto
      },
      (err: HttpErrorResponse) => {
        this.submitted = false;
        this.loading.close();                                     // Cierra el Loading
        this.snack.show('danger', 'Error', 'top', 'rigth');       // Muestra notificación de error
        this.listErrors = err.error;                              // Pone errores para mostrar
      }
    );
  }
  /* --------------------------------------- */

  /** Abre dialog de correcto */
  private triggerResetPassDialog(email: string): void{
    this.dialogRef = this.dialog.open(ForgotPassDialogComponent, {  // Abre dialog de correcto
      data: { email },
      maxWidth: '400px'
    });

    this.dialogRef.afterClosed().subscribe((result) => {    // Al cerrar dialog
      this.passForm.reset();                              // Resetea form para borrar contraseña
      this.router.navigateByUrl('/auth/signin');        // Navega al Home
    });
  }
  /* --------------------------------------- */
  /*********************************************************************/
}
