import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { DeviceModel } from '../../../../global/models/device.model';
import { AuthFormUtils } from '../../../../global/helpers/auth-form.helpers';


@Component({
  selector: 'app-add-device-dialog',
  templateUrl: './add-device-dialog.component.html',
  styleUrls: ['./add-device-dialog.component.scss']
})
export class AddDeviceDialogComponent implements OnInit {

  action: string;                     // Acción de editar o agregar
  dialogTitle: string;                // Titulo del dialog
  deviceForm!: UntypedFormGroup;              // Formulario de datos
  public formValidators = new AuthFormUtils();   // Funciones de formulario
  device !: DeviceModel;                // Modelo de datos

  constructor(
    public dialogRef: MatDialogRef<AddDeviceDialogComponent>,   // Agrega dialog
    @Inject(MAT_DIALOG_DATA) public data: any,                  // Agrega datos de dialog
    private formBuilder: UntypedFormBuilder,                          // Creador de formularios
  ) {

    this.action = data.action;                         // Obtiene acccion de datos recibidos

    if (this.action === 'edit') {                      // Si la acción es editar
      this.dialogTitle = 'Editar Dispositivo';         // Pone titulo de editar
      this.device = data.device;                       // Establece los datos con los que recibe
    } else {                                           // Acción de agregar
      this.dialogTitle = 'Agregar Dispositivo';        // Pone titulo de agregar
    }
  }

  ngOnInit(): void {
    this.createDeviceForm();    // Crea formulario reactivo
  }

  /** Crea formulario reactivo de Registrar */
  private createDeviceForm(): void {
    this.deviceForm = this.formBuilder.group({
      alias: [this.device?.alias || 'Mi dispositivo', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      serial: [this.device?.serial, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    });

    this.formValidators.initFormGroup(this.deviceForm);     // Inicializa utilidades de formulario
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
