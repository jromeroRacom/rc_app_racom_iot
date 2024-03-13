import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AuthFormUtils } from '../../../../../../global/helpers/auth-form.helpers';
import { MqttAclTableModel } from '../../mqtt-acl-table.model';

@Component({
  selector: 'app-add-mqtt-acl-dialog',
  templateUrl: './add-mqtt-acl-dialog.component.html',
  styleUrls: ['./add-mqtt-acl-dialog.component.scss']
})
export class AddMqttAclDialogComponent implements OnInit {

  action: string;                     // Acción de editar o agregar
  dialogTitle: string;                           // Titulo del dialog
  mqttAclForm!: UntypedFormGroup;                      // Formulario de datos
  public formValidators = new AuthFormUtils();   // Funciones de formulario
  mqttAcl !: MqttAclTableModel;                // Modelo de datos

  constructor(
    public dialogRef: MatDialogRef<AddMqttAclDialogComponent>,   // Agrega dialog
    @Inject(MAT_DIALOG_DATA) public data: any,                  // Agrega datos de dialog
    private formBuilder: UntypedFormBuilder,                          // Creador de formularios
  ) {
    this.action = data.action;                         // Obtiene acccion de datos recibidos

    if (this.action === 'edit') {                      // Si la acción es editar
      this.dialogTitle = 'Editar ACL MQTT';         // Pone titulo de editar
      this.mqttAcl = data.mqttAcl;               // Establece los datos con los que recibe
    } else {                                           // Acción de agregar
      this.dialogTitle = 'Agregar ACL MQTT';        // Pone titulo de agregar
    }
  }

  ngOnInit(): void {
    this.createDeviceForm();    // Crea formulario reactivo
  }

  /** Crea formulario reactivo de Registrar */
  private createDeviceForm(): void {
    this.mqttAclForm = this.formBuilder.group({
      allow: [this.mqttAcl?.allow || false, [Validators.required]],
      access: [this.mqttAcl?.access || 0, [Validators.required, Validators.min(0), Validators.max(3)]],
      topic: [this.mqttAcl?.topic, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    });

    this.formValidators.initFormGroup(this.mqttAclForm);     // Inicializa utilidades de formulario
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
