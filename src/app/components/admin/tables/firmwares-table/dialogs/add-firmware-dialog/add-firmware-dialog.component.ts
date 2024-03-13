import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AuthFormUtils } from '../../../../../../global/helpers/auth-form.helpers';
import { FirmwareTableModel } from '../../firmwares-table.model';

@Component({
  selector: 'app-add-firmware-dialog',
  templateUrl: './add-firmware-dialog.component.html',
  styleUrls: ['./add-firmware-dialog.component.scss']
})
export class AddFirmwareDialogComponent implements OnInit {

  dialogTitle: string;                           // Titulo del dialog
  public selectedValue = '';
  firmwareForm!: UntypedFormGroup;                      // Formulario de datos
  public formValidators = new AuthFormUtils();   // Funciones de formulario
  firmware !: FirmwareTableModel;                // Modelo de datos

  constructor(
    public dialogRef: MatDialogRef<AddFirmwareDialogComponent>,   // Agrega dialog
    @Inject(MAT_DIALOG_DATA) public data: any,                  // Agrega datos de dialog
    private formBuilder: UntypedFormBuilder,                          // Creador de formularios
  ) {
    this.dialogTitle = 'Agregar Firmware';        // Pone titulo de agregar
  }

  ngOnInit(): void {
    this.createDeviceForm();    // Crea formulario reactivo
  }

  /** Crea formulario reactivo de Registrar */
  private createDeviceForm(): void {
    this.firmwareForm = this.formBuilder.group({
      version: [, [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      type: [this.selectedValue, [Validators.required]],
      file: [, [Validators.required]],
      fileSource: ['', [Validators.required]]
    });

    this.formValidators.initFormGroup(this.firmwareForm);     // Inicializa utilidades de formulario
  }
  /* --------------------------------------- */

  /** Al salir de dialog sin pulsar algún botón */
  onNoClick(): void {
    this.dialogRef.close();
  }
  /* --------------------------------------- */

  changeFile(event: any): void{
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.firmwareForm.patchValue({
        fileSource: file
      });
    }
  }

  /** Al presionar submit */
  onSubmit(): void { }
  /* --------------------------------------- */

  public get getImage(): string{
    return this.formValidators.getFormValue('type') || 'none';
  }

}
