import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private snackBar: MatSnackBar,                        // Alertas en forma de snackbar
  ) {
  }

  /**  Mostrar snackbar */
  public show(colorName: string, text: string, placementFrom: any, placementAlign: any, duration: number = 2000): void {
    this.snackBar.open(text, '', {
      duration,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: `snackbar-${colorName}`
    });
  }
  /* --------------------------------------- */

}
