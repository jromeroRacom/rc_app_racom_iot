import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AuthFormUtils } from '../../../../../../global/helpers/auth-form.helpers';
import { RolesTableModel } from '../../roles-table.model';

@Component({
  selector: 'app-add-role-dialog',
  templateUrl: './add-role-dialog.component.html',
  styleUrls: ['./add-role-dialog.component.scss']
})
export class AddRoleDialogComponent implements OnInit {

  action: string;                                // Acción de editar o agregar
  dialogTitle: string;                           // Titulo del dialog
  roleForm!: UntypedFormGroup;                          // Formulario de datos
  public formValidators = new AuthFormUtils();   // Funciones de formulario
  role !: RolesTableModel;                       // Modelo de datos

  constructor(
    public dialogRef: MatDialogRef<AddRoleDialogComponent>,   // Agrega dialog
    @Inject(MAT_DIALOG_DATA) public data: any,                  // Agrega datos de dialog
    private formBuilder: UntypedFormBuilder,                          // Creador de formularios
  ) {
    this.action = data.action;                         // Obtiene acccion de datos recibidos

    if (this.action === 'edit') {              // Si la acción es editar
      this.dialogTitle = 'Editar Rol';         // Pone titulo de editar
      this.role = data.role;                   // Establece los datos con los que recibe
    } else {                                   // Acción de agregar
      this.dialogTitle = 'Agregar Rol';        // Pone titulo de agregar
    }
  }

  ngOnInit(): void {
    this.createDeviceForm();    // Crea formulario reactivo
  }

  /** Crea formulario reactivo de Registrar */
  private createDeviceForm(): void {
    this.roleForm = this.formBuilder.group({
      role: [this.role?.role.toUpperCase(), [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    });

    this.formValidators.initFormGroup(this.roleForm);     // Inicializa utilidades de formulario
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
