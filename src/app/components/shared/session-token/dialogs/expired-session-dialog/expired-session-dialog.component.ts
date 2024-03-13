import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-expired-session-dialog',
  templateUrl: './expired-session-dialog.component.html',
  styleUrls: ['./expired-session-dialog.component.scss']
})
export class ExpiredSessionDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ExpiredSessionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      dialogRef.disableClose = true;
  }


  ngOnInit(): void {
  }

  onNoClick(): void {              // Cerra dialogo si se presiona cancelar
    this.dialogRef.close();
  }

}
