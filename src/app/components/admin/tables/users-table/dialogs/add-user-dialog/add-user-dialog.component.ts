import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { AuthFormUtils } from '../../../../../../global/helpers/auth-form.helpers';
import { UsersTableModel } from '../../users-table.model';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss']
})
export class AddUserDialogComponent implements OnInit {

  action: string;                     // Acción de editar o agregar
  dialogTitle: string;                // Titulo del dialog
  userForm!: UntypedFormGroup;              // Formulario de datos
  public formValidators = new AuthFormUtils();   // Funciones de formulario
  user !: UsersTableModel;                // Modelo de datos

  public hide = true;                             // Flag mostrar contraseña
  public chide = true;                            // Flag mostrar repetir contraseña
  public flagEditPass = false;                               // Flag para saber si se modifica pass


  constructor(
    public dialogRef: MatDialogRef<AddUserDialogComponent>,   // Agrega dialog
    @Inject(MAT_DIALOG_DATA) public data: any,                  // Agrega datos de dialog
    private formBuilder: UntypedFormBuilder,                          // Creador de formularios
  ) {

    this.action = data.action;                         // Obtiene acccion de datos recibidos

    if (this.action === 'edit') {                      // Si la acción es editar
      this.dialogTitle = 'Editar Usuario';         // Pone titulo de editar
      this.user = data.user;                       // Establece los datos con los que recibe
    } else {                                           // Acción de agregar
      this.dialogTitle = 'Agregar Usuario';        // Pone titulo de agregar
    }
  }

  ngOnInit(): void {
    this.createDeviceForm();    // Crea formulario reactivo

    const email = this.userForm.get('email') ;
    const pass = this.userForm.get('password') ;
    const passNew = this.userForm.get('cpassword');

    this.userForm.get('showPass')?.valueChanges
    .subscribe(showPass => {
      if (showPass === true) {
        this.flagEditPass = true;
        pass?.setValidators([Validators.required, Validators.maxLength(50), Validators.minLength(6)]);
        passNew?.setValidators([Validators.required, Validators.maxLength(50), Validators.minLength(6)]);

        pass?.enable(); passNew?.enable();
      } else {
        this.flagEditPass = false;
        passNew?.setValidators(null);
        passNew?.setValue(''); passNew?.disable();
        passNew?.markAsUntouched();
        pass?.setValue(''); pass?.disable();
        pass?.setValidators(null);
        pass?.markAsUntouched();
      }

      pass?.updateValueAndValidity();
      passNew?.updateValueAndValidity();
    });
  }

  /** Crea formulario reactivo de Registrar */
  private createDeviceForm(): void {
    this.userForm = this.formBuilder.group({
      name: [this.user?.name,
        [ Validators.required, Validators.maxLength(50),
          Validators.minLength(2), Validators.pattern(
            '^[a-z0-9A-ZÀ-ÿ\u00f1\u00d1 ]+(s*[a-z0-9A-ZÀ-ÿ\u00f1\u00d1]*)*[a-z0-9A-ZÀ-ÿ\u00f1\u00d1]+$'
          )
        ]
      ],
      email: [this.user?.email,
        [Validators.required, Validators.maxLength(50), Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]
      ],
      state: [this.user?.state, Validators.required],
      role: [this.user?.role, Validators.required],
      password: ['', [ Validators.required, Validators.maxLength(50), Validators.minLength(6)]],
      cpassword: ['', [Validators.required]],
      showPass: [this.flagEditPass]
    }, {
      validators: this.formValidators.validatorPasswords('password', 'cpassword')
    }
  );

    this.formValidators.initFormGroup(this.userForm);     // Inicializa utilidades de formulario

    if (this.action === 'edit'){
      this.userForm?.get('password')?.setValue('');
      this.userForm?.get('password')?.disable();
      this.userForm?.get('cpassword')?.setValue('');
      this.userForm?.get('cpassword')?.disable();
    }
  }
  /* --------------------------------------- */

  /** Al salir de dialog sin pulsar algún botón */
  onNoClick(): void {
    this.dialogRef.close();
  }
  /* --------------------------------------- */

  /** Al presionar submit */
  onSubmit(): void { }
  /* --------------------------------------- */

}
