import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-idle-dialog',
  templateUrl: './idle-dialog.component.html',
  styleUrls: ['./idle-dialog.component.scss']
})
export class IdleDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<IdleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      dialogRef.disableClose = true;
  }

  ngOnInit(): void {
  }

  onNoClick(): void {              // Cerra dialogo si se presiona cancelar
    this.dialogRef.close();
  }

}
