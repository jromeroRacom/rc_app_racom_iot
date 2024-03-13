import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ErrorsModel, ResponseModel } from 'src/app/global/models/back-end.models';

import { AuthService } from '../auth.service';
import { SnackBarService } from '../../../global/services/snack-bar.service';
import { AuthFormUtils } from '../../../global/helpers/auth-form.helpers';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.scss']
})
export class ResetPassComponent implements OnInit {
  public resetPassForm!: UntypedFormGroup;            // Formulario reactivo
  public listErrors = new ErrorsModel();       // Lista de errores
  public hide = true;                          // Flag mostrar contraseña
  public chide = true;                         // Flag mostrar repetir contraseña
  public formValidators = new AuthFormUtils(); // Funciones de formulario
  private destroy$ = new Subject();            // Observable para acciones de destroy
  loading: boolean;                            // Bandera para logging con spinner
  submitted: boolean;                          // Bandera de submitted
  tokenValidate: string ;                      // Token de verificación
  error: boolean;                              // Bandera de error
  msg: string;                                 // Mensaje de correcto

  /** Constructor */
  constructor(
    private formBuilder: UntypedFormBuilder, // Creador de formularios
    private router: Router,           // Manejo de rutas
    private route: ActivatedRoute,    // Manejo de ruta actual
    public dialog: MatDialog,         // Para uso de Dialogs
    public snack: SnackBarService,    // Servicio de snack bar personalizado
    private authService: AuthService  // Servicio de auth
  ) {
    this.loading = false;
    this.tokenValidate = '';
    this.error = false;
    this.msg = '';
    this.submitted = false;
  }
  /* --------------------------------------- */

  /** Ciclo de vide de Inicio */
  ngOnInit(): void {
    this.tokenValidate = this.route.snapshot.paramMap.get('token') || 'none';   // Obtiene token de verificación
    this.createresetPassForm();                                       // Crea formulario reactivo
  }
  /* --------------------------------------- */

  /******************* Acciones de formulario ***************************/

  /** Crea formulario reactivo de Registrar */
  private createresetPassForm(): void {
    this.resetPassForm = this.formBuilder.group(
      {
        password: [ '', [ Validators.required, Validators.maxLength(50), Validators.minLength(6) ] ],
        cpassword: ['', [Validators.required]]
      },
      {
        validators: this.formValidators.validatorPasswords('password', 'cpassword')
      }
    );
    this.formValidators.initFormGroup(this.resetPassForm);     // Inicializa utilidades de formulario
  }
  /* --------------------------------------- */

  /** Al presionar submit */
  onSubmit(): void {
    this.loading = true;
    if (this.checkValidForm()){ this.doResetPass(); }  // Si es valido hace logica de registrar
  }
  /* --------------------------------------- */

  /** Logica de reestablecer contraseña */
  private doResetPass(): void {
    const pass =  this.formValidators.getFormValue('password');     // Obtiene contraseña

    this.authService.doPassReset(pass, this.tokenValidate).pipe(takeUntil(this.destroy$)).subscribe(  // Petición a reset pass
      (data: ResponseModel) => {                             // Recepción correcta
        this.loading = false;                                // Cierra el Loading
        this.snack.show('success', 'Se ha restablecido la contraseña', 'top', 'center'); // Muestra snack de correcto
        this.msg = data.msg || 'Correcto';
        this.resetPassForm.reset();
        this.submitted = true;
        timer(3000).subscribe(val => {this.router.navigateByUrl('/auth/signin'); });
      },
      (err: HttpErrorResponse) => {
        this.error = true;
        this.loading = false;                                     // Cierra el Loading
        this.snack.show('danger', 'Error', 'top', 'rigth');       // Muestra notificación de error
        this.listErrors = err.error;                              // Pone errores para mostrar
      }
    );
  }
  /* --------------------------------------- */

  /** Checa si el formulario es valido */
  private checkValidForm(): boolean {
    if (!this.formValidators.isFormValid) {     // Si no es valido
      this.loading = false;
      this.error = true;                       // Muestra error
      this.listErrors.errors = [{              // Mensaje de error
        msg: 'Campos incorrectos por favor verifica los datos ingresados'
      }];
      this.formValidators.formMarkAsTouched();  // Marca campos como marcados
      return false;                              // Retorna falso
    } else { return true; }                      // Retorna verdadero
  }
  /* --------------------------------------- */


  /*********************************************************************/
}
