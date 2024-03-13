import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ErrorsModel, ResponseModel } from 'src/app/global/models/back-end.models';

import { RegisterDialogComponent } from './dialogs/register-dialog/register-dialog.component';

import { AuthService } from '../auth.service';
import { SnackBarService } from '../../../global/services/snack-bar.service';
import { AuthFormUtils } from '../../../global/helpers/auth-form.helpers';
import { LoadingDialogService } from '../../../global/services/loading-dialog.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  public registerForm!: UntypedFormGroup;                // Formulario reactivo
  public listErrors = new ErrorsModel();          // Lista de errores
  public hide = true;                             // Flag mostrar contraseña
  public chide = true;                            // Flag mostrar repetir contraseña
  public formValidators = new AuthFormUtils();   // Funciones de formulario
  private destroy$ = new Subject();               // Observable para acciones de destroy
  private dialogRef!: MatDialogRef<RegisterDialogComponent>; // Referencia para dialog de eventos


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
    this.createRegisterForm();    // Crea formulario reactivo
  }
  /* --------------------------------------- */

  /** Ciclo de vide de Final */
  ngOnDestroy(): void {
    this.destroy$.next();     // Dispara Observable
    this.destroy$.complete(); // Finaliza Observable
  }
  /* --------------------------------------- */

  /******************* Acciones de formulario ***************************/

  /** Crea formulario reactivo de Registrar */
  private createRegisterForm(): void {
    this.registerForm = this.formBuilder.group({
        name: ['',
          [
            Validators.required, Validators.maxLength(50),
            Validators.minLength(2), Validators.pattern(
              '^[a-z0-9A-ZÀ-ÿ\u00f1\u00d1 ]+(s*[a-z0-9A-ZÀ-ÿ\u00f1\u00d1]*)*[a-z0-9A-ZÀ-ÿ\u00f1\u00d1]+$'
            )
          ]
        ],
        email: ['',
          [Validators.required, Validators.maxLength(50), Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]
        ],
        password: ['',
          [ Validators.required, Validators.maxLength(50), Validators.minLength(6)]
        ],
        cpassword: ['', [Validators.required]]
      }, {
        validators: this.formValidators.validatorPasswords('password', 'cpassword')
      }
    );
    this.formValidators.initFormGroup(this.registerForm);     // Inicializa utilidades de formulario
  }
  /* --------------------------------------- */

  /** Al presionar submit */
  onSubmit(): void {
    this.loading.show();                               // Muestra dialog de loading
    if (this.checkValidForm()){ this.doRegister(); }  // Si es valido hace logica de registrar
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

  /** Logica de registrar */
  private doRegister(): void {
    const email = this.formValidators.getFormValue('email');        // Obtiene email
    const name =  this.formValidators.getFormValue('name').trim();  // Obtiene nombre
    const pass =  this.formValidators.getFormValue('password');     // Obtiene contraseña

    this.authService.register(name, email, pass).pipe(takeUntil(this.destroy$)).subscribe(  // Petición a login
      (data: ResponseModel) => {                             // Recepción correcta
        this.loading.close();                                // Cierra el Loading
        this.snack.show('success', 'Se ha enviado un correo para validar cuenta', 'top', 'right'); // Muestra snack de correcto
        this.triggerRegisterDialog(name, email);    // Abre dialog de correcto
      },
      (err: HttpErrorResponse) => {
        this.loading.close();                                     // Cierra el Loading
        this.snack.show('danger', 'Error', 'top', 'rigth');       // Muestra notificación de error
        this.listErrors = err.error || '{ok:false,errors:[{msg: Error Inesperado}]}'; // Pone errores para mostrar
      }
    );
  }
  /* --------------------------------------- */

  /** Abre dialog de correcto */
  private triggerRegisterDialog(user: string, email: string): void{
    this.dialogRef = this.dialog.open(RegisterDialogComponent, {  // Abre dialog de correcto
      data: { user, email },
      maxWidth: '400px'
    });

    this.dialogRef.afterClosed().subscribe((result) => {    // Al cerrar dialog
      this.registerForm.reset();                              // Resetea form para borrar contraseña
      this.router.navigateByUrl('/auth/signin');        // Navega al Home
    });
  }
  /* --------------------------------------- */
  /*********************************************************************/
}
