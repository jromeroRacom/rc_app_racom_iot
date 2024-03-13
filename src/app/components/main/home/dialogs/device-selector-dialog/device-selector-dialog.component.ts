import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-device-selector-dialog',
  templateUrl: './device-selector-dialog.component.html',
  styleUrls: ['./device-selector-dialog.component.scss']
})
export class DeviceSelectorDialogComponent implements OnInit {

  public deviceControl = new UntypedFormControl('', Validators.required);
  public selectedValue = '';

  constructor(
    public dialogRef: MatDialogRef<DeviceSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
  }

  onNoClick(): void {              // Cerra dialogo si se presiona cancelar
    this.dialogRef.close();
  }


}
