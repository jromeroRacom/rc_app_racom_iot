import { Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,     // Define dialog
    @Inject(MAT_DIALOG_DATA) public data: any,                 // Datos de dialog
  ) {}

  ngOnInit(): void {
  }

  onNoClick(): void {              // Cerra dialogo si se presiona cancelar
    this.dialogRef.close();
  }
}
