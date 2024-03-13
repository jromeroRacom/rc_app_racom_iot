import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AuthFormUtils } from '../../../../../../global/helpers/auth-form.helpers';
import { MqttUsersTableModel } from '../../mqtt-users-table.model';

@Component({
  selector: 'app-add-mqtt-user-dialog',
  templateUrl: './add-mqtt-user-dialog.component.html',
  styleUrls: ['./add-mqtt-user-dialog.component.scss']
})
export class AddMqttUserDialogComponent implements OnInit {

  action: string;                     // Acción de editar o agregar
  dialogTitle: string;                           // Titulo del dialog
  mqttUserForm!: UntypedFormGroup;                      // Formulario de datos
  public formValidators = new AuthFormUtils();   // Funciones de formulario
  mqttUser !: MqttUsersTableModel;                // Modelo de datos

  constructor(
    public dialogRef: MatDialogRef<AddMqttUserDialogComponent>,   // Agrega dialog
    @Inject(MAT_DIALOG_DATA) public data: any,                  // Agrega datos de dialog
    private formBuilder: UntypedFormBuilder,                          // Creador de formularios
  ) {
    this.action = data.action;                         // Obtiene acccion de datos recibidos

    if (this.action === 'edit') {                      // Si la acción es editar
      this.dialogTitle = 'Editar usuario MQTT';         // Pone titulo de editar
      this.mqttUser = data.mqttUser;               // Establece los datos con los que recibe
    } else {                                           // Acción de agregar
      this.dialogTitle = 'Agregar usuario MQTT';        // Pone titulo de agregar
    }
  }

  ngOnInit(): void {
    this.createDeviceForm();    // Crea formulario reactivo
  }

  /** Crea formulario reactivo de Registrar */
  private createDeviceForm(): void {
    this.mqttUserForm = this.formBuilder.group({
      is_superuser: [this.mqttUser?.is_superuser || false, [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      username: [this.mqttUser?.username, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      password: [this.mqttUser?.password, [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
    });

    this.formValidators.initFormGroup(this.mqttUserForm);     // Inicializa utilidades de formulario
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
