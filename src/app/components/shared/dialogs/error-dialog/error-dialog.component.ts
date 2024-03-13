import { Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,     // Define dialog
    @Inject(MAT_DIALOG_DATA) public data: any,                 // Datos de dialog
  ) {}

  ngOnInit(): void {
  }

  onNoClick(): void {              // Cerra dialogo si se presiona cancelar
    this.dialogRef.close();
  }

}
