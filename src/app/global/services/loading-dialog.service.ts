import { Injectable } from '@angular/core';
import { LoadingDialogComponent } from '../../components/shared/dialogs/loading-dialog/loading-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class LoadingDialogService {
  private dialogRef!: MatDialogRef<LoadingDialogComponent>;

  /** Constructor */
  constructor(
    public dialog: MatDialog // Para uso de Dialogs
  ) {}
  /* --------------------------------------- */

   /**  Mostrar dialog de loading */
  public show(): void {
    this.dialogRef = this.dialog.open(LoadingDialogComponent, {});
  }
  /* --------------------------------------- */

  /** Cerrar dialog de loaging */
  public close(): void {
    this.dialogRef.close();
  }
  /* --------------------------------------- */
}
