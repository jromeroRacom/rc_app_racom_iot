import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceTableRowModel } from '../../main/tables/user-devices-table/user-devices-table.model';
import { SnackBarService } from '../../../global/services/snack-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { AddDeviceDialogComponent } from '../../shared/dialogs/add-device-dialog/add-device-dialog.component';
import { LoadingDialogService } from '../../../global/services/loading-dialog.service';
import { MainService } from '../../main/main.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ResponseModel, ErrorModel } from '../../../global/models/back-end.models';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorDialogComponent } from '../../shared/dialogs/error-dialog/error-dialog.component';
import { CbstService } from '../cbst.service';
import { DeviceIoTModel } from '../../../global/models/device.model';
import { ConfirmDialogComponent } from '../../shared/dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-cbst-settings',
  templateUrl: './cbst-settings.component.html',
  styleUrls: ['./cbst-settings.component.scss']
})
export class CbstSettingsComponent implements OnInit, OnDestroy {

  public deviceConfig !: DeviceIoTModel | undefined; // Datos de configuración de dispositivo
  private destroy$ = new Subject();                          // Observable para acciones de destroy

  constructor(
    private mainService: MainService,      // Servicio de main
    private loading: LoadingDialogService,            // Servicio de dialog loaging personalizado
    public snack: SnackBarService,                    // Servicio de snack bar personalizado
    public dialog: MatDialog,                         // Para uso de Dialogs
    private cbstService: CbstService,       // Servicio de cbst
  ) { }

  ngOnInit(): void {
    this.cbstService.onDeviceConfig()
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.deviceConfig = data;
    });
  }

   /** Ciclo de vide de Final */
   ngOnDestroy(): void {
    this.destroy$.next();     // Dispara Observable
    this.destroy$.complete(); // Finaliza Observable
  }
  /* --------------------------------------- */


  /** Edita alias de dispositivo  */
  public editDevice(): void {
    const dialogRef = this.dialog.open(AddDeviceDialogComponent, {  // Dialog de agregar
      data: { device: {
        serial: this.deviceConfig?.device.serial || '',
        alias: this.deviceConfig?.device.alias || '',
        type: this.deviceConfig?.device.type || 'none',
      }, action: 'edit' }
    });

    dialogRef.afterClosed().subscribe((result) => {   // Al cerrarse el dialog
      if (result) {                                   // Se se cerro correctamente
        const {alias, serial} = result;               // Obtiene datos de dialog
        this.logicUpdateDevice(serial, alias);
      }
    });
  }
  /* --------------------------------------- */

  public deleteFlashCBST(): void{
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {  // Dialog de confirmación
      maxWidth: '455px',
      data: {
        title: '¿Estás Seguro?',
        text: 'Se borrará los datos de arranques y horometro, ademas el sistema pasará a modo FUERA',
        type: 'primary'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {     // Al cerrarse
      if (result === 1) {                               // Si se acepto
        this.snack.show('success',                     // Muestra notificacion de agregado correctamente
          'Comando enviado!!!',
          'top', 'center'
        );
        const topic = `/${this.deviceConfig?.mqtt.topic}/in/cmd`;
        this.cbstService.mqttOnPublish(topic, `{"val": ${1} }`)
          .pipe(takeUntil(this.destroy$)).subscribe();
      }
    });
  }

  /** Lógica para asignar dispositivo a usuario */
  private logicUpdateDevice(serial: string, alias: string): void{
    this.loading.show();                                // Muestra loading
    this.mainService.userUpdateDevice(serial, alias)    // Petición de actualizar
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (data: ResponseModel) => {                              // Recepción correcta
        this.loading.close();                                 // Cierra el Loading
        if (this.deviceConfig){
          this.deviceConfig.device.alias = alias;               // Pone nuevo alias
          this.cbstService.setDeviceConfig = this.deviceConfig; // Pone nueva configuracion
        }
        this.snack.show('success',                            // Muestra notificacion de agregado correctamente
          'Dispositivo actualizado correctamente!!!',
          'top', 'center'
        );
      },
      (err: HttpErrorResponse) => {                               // Error de recepción
        this.loading.close();                                     // Cierra el Loading
        this.snack.show('danger', 'Error', 'top', 'rigth');       // Muestra notificación de error
        this.triggerErrorDialog(err.error?.errors || [{msg: 'Error inesperado'}] , 'Error al agregar dispositivo');
      }
    );
  }
  /* --------------------------------------- */

  /** Dispara dialog de error */
  private triggerErrorDialog(errors: ErrorModel[], title: string = ''): void{
    this.dialog.open(ErrorDialogComponent, {  // Configuracion para dialog de agregar
      maxWidth: '355px',
      data: { title, errors }
    });
  }
  /* --------------------------------------- */

}
