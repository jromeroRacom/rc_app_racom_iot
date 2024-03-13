import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss']
})
export class EventDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
  }

  onNoClick(): void {              // Cerra dialogo si se presiona cancelar
    this.dialogRef.close();
  }

}
