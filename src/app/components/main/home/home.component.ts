import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { OwlOptions } from 'ngx-owl-carousel-o';

import { ApiDevicesModel, ErrorModel } from '../../../global/models/back-end.models';
import { OwlCarouserlModel } from '../../../global/models/owl-carouser.model';

import { ErrorDialogComponent } from '../../shared/dialogs/error-dialog/error-dialog.component';
import { DeviceSelectorDialogComponent } from './dialogs/device-selector-dialog/device-selector-dialog.component';

import { MainService } from '../main.service';
import { LoadingDialogService } from '../../../global/services/loading-dialog.service';
import { ConfirmDialogComponent } from '../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '../../../global/services/snack-bar.service';
import { AddDeviceDialogComponent } from '../../shared/dialogs/add-device-dialog/add-device-dialog.component';
import { DeviceModel } from '../../../global/models/device.model';
import { NavigationService } from '../../../global/services/navigation.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  public isMobile = false;                 // Bandera para saber si es movil
  public width = window.innerWidth;        // Obtiene ancho de pantalla
  public height = window.innerHeight;      // Obtiene alto de pantalla
  public mobileWidth = 760;                // Tamaño para determinar si es movil
  private destroy$ = new Subject();                          // Observable para acciones de destroy
  public slidesStore: OwlCarouserlModel[] = [];          // Arreglo de imagenes
  private imagesURL = 'assets/data/main-carousel.json';   // Datos de imagenes

  public customOptions: OwlOptions = {     // Opciones para carousel
    center: true,
    items: 3,
    loop: true,
    margin: 10,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    responsive: {
      0: { items: 1},
      600: { items: 2 },
      1000: { items: 3}
    }
  };

  /** Constructor */
  constructor(
    private loading: LoadingDialogService, // Servicio de dialog loaging personalizado
    public snack: SnackBarService,         // Servicio de snack bar personalizado
    public dialog: MatDialog,              // Para uso de Dialogs
    public router: Router,                 // Manejo de rutas
    private http: HttpClient,              // Servicio de hhtp cliente
    private mainService: MainService,      // Servicio de main
    private navigation: NavigationService  // Servicio de navegacion

  ) {
    this.http.get(this.imagesURL).subscribe((data: any) => {   // Obtiene datos de imagenes
      this.slidesStore = data;
     });
    this.isMobile = this.width < this.mobileWidth;             // Establece si es movil
  }
  /* --------------------------------------- */

  /** Ciclo de vide de Inicio */
  ngOnInit(): void {
    this.navigation.resetHistory();     // Reinicia historial de navegacion
  }
  /* --------------------------------------- */

  /** Ciclo de vide de Final */
  ngOnDestroy(): void {
    this.destroy$.next();     // Dispara Observable
    this.destroy$.complete(); // Finaliza Observable
  }
  /* --------------------------------------- */

  /**
   * Obtiene dimension de menú
   * @param event Evento de resize
   */
   @HostListener('window:resize', ['$event'])   // Decorador de host
   onWindowResize(event: any): void {
    this.width = event.target.innerWidth;          // Obtiene ancho de pantalla
    this.height = event.target.innerHeight;        // Obtiene alto de pantalla
    this.isMobile = this.width < this.mobileWidth; // Determina si es movil
  }
  /* --------------------------------------- */

  /** Logica para obtener dispositivos */
  logicGetDevices(): void {
    this.loading.show();                                                         // Muestra loading
    this.mainService.userGetDevices().pipe(takeUntil(this.destroy$)).subscribe(  // Petición a obtener dispositivos
      (data: ApiDevicesModel) => {                     // Recepción correcta
        this.loading.close();                          // Cierra loading
        this.devicesRouteLogic(data);                  // Lógica d ever dispositivos
      },
      (error: HttpErrorResponse) => {                  // Error
        this.loading.close();                          // Cierra loading
        this.triggerErrorDialog(error.error.errors);   // Dispara dialog de error
      }
    );
  }
  /* --------------------------------------- */

  /** Lógica de direccionamiento de dispositivos */
  devicesRouteLogic(data: ApiDevicesModel): void {
    const count = data.devices.count || 0;      // Obtiene cuenta de dispositivos

    if (count <= 0) { this.zeroDeviceDialog();  // Si es no hay dispositivos
    } else if (count === 1) {                   // Si solo hay uno
      const device = data.devices.rows[0];      // Obtiene info de dispositivo
      this.router.navigate([`app/devices/${device.type}`, device.serial]); // Redirecciona
    } else { this.multipleDevicesDialog(data.devices.rows); }              // Multiples dispositivos
  }
  /* --------------------------------------- */

  /** Dialog de multiples dispositivos */
  multipleDevicesDialog(devices: DeviceModel[]): void {
    const dialogRef = this.dialog.open(DeviceSelectorDialogComponent, {  // Dialog para elegir dispositivo
      maxWidth: '455px',
      data: { devices }
    });

    dialogRef.afterClosed().subscribe((result) => {           // Al cerrarse el dialog
      if (result) {
        this.router.navigate([`app/devices/${result.type}`, result.serial]);  // Redirecciona a dispositivo
      }
    });
  }
  /* --------------------------------------- */

  /** Para cuando no hay dispositivos */
  zeroDeviceDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {  // Dialog de confirmación
      maxWidth: '355px',
      data: {
        title: 'No hay dispositivos',
        text: 'No tienes ningún dispositivo vinculado a tu cuenta ¿Deseas agregar uno?',
        type: 'primary'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {    // Al cerrarse
      if (result === 1) { this.addNew(); }             // Si se presiono aceptar se agrega uno
    });
  }
  /* --------------------------------------- */

  addNew(): void {        // Agrega un registro nuevo
    const dialogRef = this.dialog.open(AddDeviceDialogComponent, {  // Dialog de agregar
      data: {action: 'add' }
    });

    dialogRef.afterClosed().subscribe((result) => {   // Al cerrarse el dialog
      if (result) {                                   // Se se cerro correctamente
        const {alias, serial} = result;               // Obtiene datos de dialog
        this.logicAddDevice(serial, alias);
      }
    });

  }
  /* --------------------------------------- */

  /** Logica para agregar un dispositivo */
  private logicAddDevice(serial: string, alias: string): void{
    this.loading.show();
    this.mainService.userAssingDevice(serial, alias).pipe(takeUntil(this.destroy$)).subscribe(  // Petición a obtener dispositivos
      (data: ApiDevicesModel) => {                     // Recepción correcta
        this.loading.close();                          // Cierra loading
        this.snack.show('success',
        'Un dispositivo a sido agregado correctamente!!!',
        'top',
        'center');
      },
      (error: HttpErrorResponse) => {                  // Error
        this.loading.close();                          // Cierra loading
        this.triggerErrorDialog(                       // Dispara dialog de error
          error.error?.errors || [{msg: 'Error inesperado'}],
          'Error al agregar dispositivo');
      }
    );
  }

  /** Dispara dialog de error */
  private triggerErrorDialog(errors: ErrorModel[], title: string = ''): void{
    this.dialog.open(ErrorDialogComponent, {  // Configuracion para dialog de agregar
      maxWidth: '355px',
      data: { title, errors }
    });
  }
  /* --------------------------------------- */
}
