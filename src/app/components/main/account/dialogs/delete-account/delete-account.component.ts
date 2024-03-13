import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { AuthFormUtils } from '../../../../../global/helpers/auth-form.helpers';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss']
})
export class DeleteAccountComponent implements OnInit {

  public deleteForm!: UntypedFormGroup;                 // Formulario de datos
  public formValidators = new AuthFormUtils();   // Funciones de formulario
  public hide = true;                            // Ocultar contraseña actual

  constructor(
    public dialogRef: MatDialogRef<DeleteAccountComponent>,
    private formBuilder: UntypedFormBuilder,      // Creador de formularios
    @Inject(MAT_DIALOG_DATA) public data: any) {
      dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.createDeleteForm();    // Crea formulario reactivo
  }

  onNoClick(): void {              // Cerra dialogo si se presiona cancelar
    this.dialogRef.close();
  }

   /** Crea formulario reactivo de Registrar */
   private createDeleteForm(): void {
    this.deleteForm = this.formBuilder.group({
      password: ['',
        [ Validators.required, Validators.maxLength(50), Validators.minLength(6)]
      ],
      code: ['', [Validators.required]]
    }, {
      validators: this.formValidators.validatorTextAndField(this.data.code, 'code')
    }
    );

    this.formValidators.initFormGroup(this.deleteForm);     // Inicializa utilidades de formulario
  }
  /* --------------------------------------- */

  /** Al presionar submit */
  onSubmit(): void {

  }
  /* --------------------------------------- */



}
