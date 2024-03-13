import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AuthFormUtils } from '../../../../../../global/helpers/auth-form.helpers';
import { DevicesTypesTableModel } from '../../devices-types-table.model';

@Component({
  selector: 'app-add-device-type-dialog',
  templateUrl: './add-device-type-dialog.component.html',
  styleUrls: ['./add-device-type-dialog.component.scss']
})
export class AddDeviceTypeDialogComponent implements OnInit {

  action: string;                     // Acción de editar o agregar
  dialogTitle: string;                           // Titulo del dialog
  deviceTypeForm!: UntypedFormGroup;                      // Formulario de datos
  public formValidators = new AuthFormUtils();   // Funciones de formulario
  deviceType !: DevicesTypesTableModel;                // Modelo de datos

  constructor(
    public dialogRef: MatDialogRef<AddDeviceTypeDialogComponent>,   // Agrega dialog
    @Inject(MAT_DIALOG_DATA) public data: any,                  // Agrega datos de dialog
    private formBuilder: UntypedFormBuilder,                          // Creador de formularios
  ) {
    this.action = data.action;                         // Obtiene acccion de datos recibidos

    if (this.action === 'edit') {                      // Si la acción es editar
      this.dialogTitle = 'Editar Tipo de Dispositivo';         // Pone titulo de editar
      this.deviceType = data.deviceType;               // Establece los datos con los que recibe
    } else {                                           // Acción de agregar
      this.dialogTitle = 'Agregar Tipo de Dispositivo';        // Pone titulo de agregar
    }
  }

  ngOnInit(): void {
    this.createDeviceForm();    // Crea formulario reactivo
  }

  /** Crea formulario reactivo de Registrar */
  private createDeviceForm(): void {
    this.deviceTypeForm = this.formBuilder.group({
      type: [this.deviceType?.type.toUpperCase(), [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
    });

    this.formValidators.initFormGroup(this.deviceTypeForm);     // Inicializa utilidades de formulario
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
