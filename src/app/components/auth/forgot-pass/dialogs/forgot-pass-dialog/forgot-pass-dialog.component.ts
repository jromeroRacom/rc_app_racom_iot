import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-forgot-pass-dialog',
  templateUrl: './forgot-pass-dialog.component.html',
  styleUrls: ['./forgot-pass-dialog.component.scss']
})
export class ForgotPassDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ForgotPassDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
  }

  onNoClick(): void {              // Cerra dialogo si se presiona cancelar
    this.dialogRef.close();
  }


}
