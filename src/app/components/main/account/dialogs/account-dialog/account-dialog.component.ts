import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-account-dialog',
  templateUrl: './account-dialog.component.html',
  styleUrls: ['./account-dialog.component.scss']
})
export class AccountDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      dialogRef.disableClose = true;
  }

  ngOnInit(): void {
  }

  onNoClick(): void {              // Cerra dialogo si se presiona cancelar
    this.dialogRef.close();
  }

}
