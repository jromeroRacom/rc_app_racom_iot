import { Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-loading-dialog',
  templateUrl: './loading-dialog.component.html',
  styleUrls: ['./loading-dialog.component.scss']
})
export class LoadingDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LoadingDialogComponent>,     // Define dialog
    @Inject(MAT_DIALOG_DATA) public data: any,                 // Datos de dialog
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
  }

  onNoClick(): void {              // Cerra dialogo si se presiona cancelar
    this.dialogRef.close();
  }

}
