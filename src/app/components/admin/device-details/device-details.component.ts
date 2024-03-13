import { take, takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { NavigationService } from '../../../global/services/navigation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceTableRowModel } from '../tables/devices-table/devices-table.model';
import { Subject, interval } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoadingDialogService } from '../../../global/services/loading-dialog.service';
import { SnackBarService } from '../../../global/services/snack-bar.service';
import { AdminService } from '../admin.service';
import { ErrorDialogComponent } from '../../shared/dialogs/error-dialog/error-dialog.component';
import { ErrorModel } from '../../../global/models/back-end.models';
import { HttpErrorResponse } from '@angular/common/http';
import { MqttDataModel } from '../admin.model';
import { AddDeviceDialogComponent } from '../tables/devices-table/dialogs/add-device-dialog/add-device-dialog.component';
import { ConfirmDialogComponent } from '../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { PermissiveDialogComponent } from '../../shared/dialogs/permissive-dialog/permissive-dialog.component';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss'],
})
export class DeviceDetailsComponent implements OnInit, OnDestroy {

  public serial: string;                   // Serial de dispositivo
  public device!: DeviceTableRowModel;     // Datos de dispositivo
  public mqttData !: MqttDataModel;        // Datos de MQTT
  private destroy$ = new Subject();        // Observable para acciones de destroy
  public dataReady = false;                // Bandera para cargar dispositivos
  private deviceTypes: any[] = [];         // Lista de dispositivos

  constructor(
    private route: ActivatedRoute,         // Manejo de ruta activa
    private router: Router,                // Menjo de rutas
    public dialog: MatDialog,              // Para uso de Dialogs
    private navigation: NavigationService, // Servicio de navegacion
    private loading: LoadingDialogService, // Servicio de dialog loaging personalizado
    public snack: SnackBarService,         // Servicio de snack bar personalizado
    private adminService: AdminService     // Servicio de administrador
  ) {
    this.serial = this.route.snapshot.paramMap.get('serial') || 'unknown'; // Obtiene serial de url
  }

  ngOnInit(): void {
    this.logicGetDeviceData();
  }

  /** Ciclo de vide de Final */
  ngOnDestroy(): void {
    this.destroy$.next();     // Dispara Observable
    this.destroy$.complete(); // Finaliza Observable
  }
  /* --------------------------------------- */

  /** Editar dispositivo */
  public editDevice(): void{
    const dialogRef = this.dialog.open(AddDeviceDialogComponent, {  // Dialog de agregar
      data: {action: 'edit' , device: this.device, types: this.deviceTypes }
    });

    dialogRef.afterClosed().subscribe((result) => {        // Al cerrarse el dialog
      if (result) {                                        // Se se cerro correctamente
        this.logicUpdateDevice(this.device.serial, result.type, result.alias);
      }
    });
  }
  /* --------------------------------------- */

  /** Borrar dispositivo */
  public deleteDevice(): void{
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {  // Dialog de confirmar
      data: { title: '¿Esta seguro?', type: 'warn',
      text: 'Se borrará el siguiente firmware',
      items: [{name: this.device.serial, value: this.device.alias}] }
    });

    dialogRef.afterClosed().subscribe(async (result) => {   // Al cerrarse el dialog
      if (result) {                                   // Se se cerro correctamente
        const {password} = await this.triggerDeleteDialog('borrar-dispositivo');
        if (password){
          this.logicPermissive(password, this.device);
        }
      }
    });
  }
  /* --------------------------------------- */

  /** Ver dispositivo */
  public reviewDevice(): void{
    this.router.navigate([`app/devices/${this.device.type.toLowerCase()}/${this.device.serial}`]);
  }
  /* --------------------------------------- */


  backClicked(): void {
    this.navigation.back();
  }

   /** Lógica para  Obtiene info de usuaios */
   private logicGetDeviceData(): void{
    this.loading.show();                                 // Muestra loading
    this.adminService.getDeviceById(this.serial)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
    (data) => {                            // Recepción correcta
      this.loading.close();                // Cierra el Loading
      this.device = data.device;           // Obtiene datos de dispositivo
      this.mqttData = data.mqtt;           // Obtiene datos de mqtt
      this.logicGetDeviceTypes();          // Obtiene tipos de dispositivos

    },
    (err: HttpErrorResponse) => {                               // Error de recepción
      this.dataReady = false;
      this.loading.close();                                     // Cierra el Loading
      this.snack.show('danger', 'Error', 'top', 'rigth');       // Muestra notificación de error
      this.triggerErrorDialog(err.error?.errors || [{msg: 'Error inesperado'}] , 'Error al obtener datos de dispositivo');
      interval(3000).pipe(takeUntil(this.destroy$), take(1)).subscribe( (val) => {  // Regresa a lista de dispositivos
        this.router.navigate([`app/admin/devices/list`]);
      });
    });
  }
  /* --------------------------------------- */

   /** Lógica para adquirir tipos de dispositivo */
   private logicGetDeviceTypes(): void{
    this.loading.show();                                 // Muestra loading
    this.adminService.getDeviceTypes()                   // Petición
      .pipe(takeUntil(this.destroy$))
      .subscribe(
      (data) => {                             // Recepción correcta
        this.loading.close();                                // Cierra el Loading
        data.types.rows.forEach((element: any) => {          // Obtiene tipos de dispositivo
          this.deviceTypes.push(element.type);
        });
      },
      (err: HttpErrorResponse) => {                               // Error de recepción
        this.loading.close();                                     // Cierra el Loading
        this.snack.show('danger', 'Error', 'top', 'rigth');       // Muestra notificación de error
        this.triggerErrorDialog(err.error?.errors || [{msg: 'Error inesperado'}] , 'Error al obtener tipos de dispositivos');
      }
    );
  }
  /* --------------------------------------- */

  /** Lógica para actualizar firmware */
  private logicUpdateDevice(serial: string, type: string, alias: string): void{
    this.loading.show();                                 // Muestra loading
    this.adminService.updateDevice(serial, type, alias)                   // Petición
      .pipe(takeUntil(this.destroy$))
      .subscribe(
      (data) => {                             // Recepción correcta
        this.loading.close();                                // Cierra el Loading
        this.snack.show('success',                           // Muestra notificacion de borrado correctamente
          'Dispositivo actualizado correctamente!!!',
          'top', 'center'
        );
      },
      (err: HttpErrorResponse) => {                               // Error de recepción
        this.loading.close();                                     // Cierra el Loading
        this.snack.show('danger', 'Error', 'top', 'rigth');       // Muestra notificación de error
        this.triggerErrorDialog(err.error?.errors || [{msg: 'Error inesperado'}] , 'Error al actualizar dispositivo');
      }
    );
  }
  /* --------------------------------------- */

   /** Hace logica de dialog */
   private triggerDeleteDialog(code: string ): Promise<any>{
    const promise = new Promise((resolve, reject) => {

      const dialogRef = this.dialog.open(PermissiveDialogComponent, {  // Dialog de confirmación
        maxWidth: '355px',
        data: { code }
      });

      dialogRef.afterClosed().subscribe((result: UntypedFormGroup) => {     // Al cerrarse
        if (result){
          if (!result.invalid){
            resolve ({password: result.get('password')?.value }) ;
          }
          reject();
        }
        resolve({password: '' });
      });
    });
    return promise;
  }
  /* --------------------------------------- */

  /** Lógica de permisivo  */
  private logicPermissive(password: string, data: any): void{
    this.loading.show();                                 // Muestra loading
    this.adminService.validatePermissive(password)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
      (val) => {                             // Recepción correcta
        this.loading.close();                                // Cierra el Loading
        this.logicDeleteDevice(data.serial);                 // Logica de borrar
      },
      (err: HttpErrorResponse) => {                               // Error de recepción
        this.loading.close();                                     // Cierra el Loading
        this.snack.show('danger', 'Error', 'top', 'rigth');       // Muestra notificación de error
        this.triggerErrorDialog(err.error?.errors || [{msg: 'Error inesperado'}] , 'Error al borrar dispositivo');
      }
    );
  }
  /* --------------------------------------- */

  /** Lógica para actualizar firmware */
  private logicDeleteDevice(serial: string): void{
    this.loading.show();                                 // Muestra loading
    this.adminService.deleteDevice(serial)                   // Petición
      .pipe(takeUntil(this.destroy$))
      .subscribe(
      (data) => {                             // Recepción correcta
        this.loading.close();                                // Cierra el Loading
        this.snack.show('success',                           // Muestra notificacion de borrado correctamente
          'Dispositivo eliminado correctamente!!!',
          'top', 'center'
        );
        interval(1500).pipe(takeUntil(this.destroy$), take(1)).subscribe( (val) => {  // Regresa a lista de usuarios
          this.router.navigate([`app/admin/devices/list`]);
        });
      },
      (err: HttpErrorResponse) => {                               // Error de recepción
        this.loading.close();                                     // Cierra el Loading
        this.snack.show('danger', 'Error', 'top', 'rigth');       // Muestra notificación de error
        this.triggerErrorDialog(err.error?.errors || [{msg: 'Error inesperado'}] , 'Error al borrar dispositivo');
      }
    );
  }
  /* --------------------------------------- */

  /** Dispara dialog de error */
  private triggerErrorDialog(errors: ErrorModel[], title: string = ''): void{
    this.dialog.open(ErrorDialogComponent, {  // Configuracion para dialog de agregar
      maxWidth: '355px',
      data: { errors, title }
    });
  }
  /* --------------------------------------- */


}

