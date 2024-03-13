import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { UserDevicesTableDataSource } from './user-devices-table.datasource';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { DeviceTableRowModel } from './user-devices-table.model';
import { UserDevicesTableService } from './user-devices-table.service';
import { fromEvent, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../../shared/dialogs/error-dialog/error-dialog.component';
import { ErrorModel, ResponseModel } from '../../../../global/models/back-end.models';
import { AddDeviceDialogComponent } from '../../../shared/dialogs/add-device-dialog/add-device-dialog.component';
import { LoadingDialogService } from '../../../../global/services/loading-dialog.service';
import { takeUntil } from 'rxjs/operators';
import { SnackBarService } from '../../../../global/services/snack-bar.service';
import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-devices-table',
  templateUrl: './user-devices-table.component.html',
  styleUrls: ['./user-devices-table.component.scss']
})
export class UserDevicesTableComponent implements OnInit, OnDestroy, AfterViewInit {

  private destroy$ = new Subject();                          // Observable para acciones de destroy
  dataSource!: UserDevicesTableDataSource;                           // Fuente de datos
  displayedColumns = ['select', 'img', 'alias', 'serial', 'macid', 'fwVersion', 'type', 'actions']; // Columnas a mostrar

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; // Obtiene referencia de paginador
  @ViewChild(MatSort, { static: true }) sort!: MatSort;                // Obtiene referencia de ordenador
  @ViewChild('filter', { static: true }) filter!: ElementRef;          // Obtiene referencia del buscador
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;             // Obtiene referencia del menú de contexto
  selection = new SelectionModel<DeviceTableRowModel>(true, []);       // Arreglo para multiple selección
  contextMenuPosition = { x: '0px', y: '0px' };                        // Establece posicion de menú de contexto

  constructor(
    public router: Router,
    private loading: LoadingDialogService,            // Servicio de dialog loaging personalizado
    private devicesService: UserDevicesTableService,  // Servicio para tabla
    public snack: SnackBarService,                    // Servicio de snack bar personalizado
    public dialog: MatDialog,                         // Para uso de Dialogs
  ) {
  }

  /** Ciclo de vide de Inicio */
  ngOnInit(): void {
    this.dataSource = new UserDevicesTableDataSource(   // Inicializa fuente de datos
      this.devicesService,                              // Servicio para data source
      this.paginator,                                   // Paginador
      this.sort                                         // Ordenador
    );

    this.dataSource.errors
    .pipe(takeUntil(this.destroy$))
    .subscribe((error: HttpErrorResponse) => {  // Manejador de errores
      this.triggerErrorDialog(error.error?.errors);                   // Dispara dialog de error
    });
  }
  /* --------------------------------------- */

  /** Ciclo de vide de Final */
  ngOnDestroy(): void {
    this.destroy$.next();     // Dispara Observable
    this.destroy$.complete(); // Finaliza Observable
  }
  /* --------------------------------------- */

  /** Ciclo de vide de Despues de iniciar vista */
  ngAfterViewInit(): void {
    fromEvent(this.filter.nativeElement, 'keyup')
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      if (!this.dataSource) { return; }
      this.selection = new SelectionModel<DeviceTableRowModel>(true, []);    // Reestablece seleccionado
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }
  /* --------------------------------------- */

  /** Agregar un nuevo dispositivo */
  addDevice(): void {
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

  /** Edita alias de dispositivo  */
  editDevice(row: DeviceTableRowModel): void {
    const dialogRef = this.dialog.open(AddDeviceDialogComponent, {  // Dialog de agregar
      data: { device: row, action: 'edit' }
    });

    dialogRef.afterClosed().subscribe((result) => {   // Al cerrarse el dialog
      if (result) {                                   // Se se cerro correctamente
        const {alias, serial} = result;               // Obtiene datos de dialog
        this.logicUpdateDevice(serial, alias);
      }
    });
  }
  /* --------------------------------------- */

  /** Borra un dispositivo */
  deleteDevice(row: DeviceTableRowModel): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {  // Dialog de confirmar
      data: { title: '¿Esta seguro?', type: 'warn',
      text: 'Se borrará el siguiente dispositivo',
      items: [{name: row.alias, value: row.serial}] }
    });

    dialogRef.afterClosed().subscribe((result) => {   // Al cerrarse el dialog
      if (result) {                                   // Se se cerro correctamente
        this.logicDeleteDevice(row.serial);
      }
    });
  }
  /* --------------------------------------- */

  /** Borra los dispositivos seleccionados */
  removeSelectedRows(): void {
    const totalSelect = this.selection.selected.length;    // Determina el total de elementos a borrar
    const arrayDevices: string[] = [];

    this.selection.selected.forEach((item) => {
      arrayDevices.push(item.serial);
    });

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {  // Dialog de confirmar
      data: {
        title: '¿Esta seguro?', type: 'warn',
        text: `Se borrarán ${totalSelect} dispositivos`,
      }
    });

    dialogRef.afterClosed().subscribe((result) => {   // Al cerrarse el dialog
      if (result) {                                   // Se se cerro correctamente
        this.logicSomeDevices(arrayDevices);
      }
    });

  }
  /* --------------------------------------- */

  /** Direcciona a componente de dispositivo */
  reviewDevice(row: DeviceTableRowModel): void {
    this.router.navigate([`app/devices/${row.type.toLowerCase()}/${row.serial}`]);
  }
  /* --------------------------------------- */

  /** Actualiza tabla */
  refreshData(): void {
    this.dataSource.getDevicesFromService();
    this.selection = new SelectionModel<DeviceTableRowModel>(true, []);    // Reestablece seleccionado
  }
  /* --------------------------------------- */

  /** Determina si estan todos seleccionados */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;          // Obtiene los seleccionados
    const numRows = this.dataSource.renderedData.length;         // Obtiene el total
    return numSelected === numRows;
  }
  /* --------------------------------------- */

  /** Lógica de toggle todos */
  masterToggle(): void {
    this.isAllSelected() ? this.selection.clear()
                         : this.dataSource.renderedData.forEach((row) => this.selection.select(row));
  }
  /* --------------------------------------- */

  /** Cobfiguración de menú de contexto */
  onContextMenu(event: MouseEvent, item: DeviceTableRowModel): void {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  /* --------------------------------------- */

  /** Lógica para asignar dispositivo a usuario */
  private logicAddDevice(serial: string, alias: string): void{
    this.loading.show();                          // Muestra loading
    this.devicesService.assingUserDevice(serial, alias).pipe(takeUntil(this.destroy$)).subscribe(  // Petición de asignar
      (data: ResponseModel) => {                             // Recepción correcta
        this.loading.close();                                // Cierra el Loading
        this.snack.show('success',                           // Muestra notificacion de agregado correctamente
          'Un dispositivo a sido agregado correctamente!!!',
          'top', 'center'
        );
        this.refreshData();    // Actualiza tabla
      },
      (err: HttpErrorResponse) => {                               // Error de recepción
        this.loading.close();                                     // Cierra el Loading
        this.snack.show('danger', 'Error', 'top', 'rigth');       // Muestra notificación de error
        this.triggerErrorDialog(err.error?.errors || [{msg: 'Error inesperado'}] , 'Error al agregar dispositivo');
      }
    );
  }
  /* --------------------------------------- */

  /** Lógica para asignar dispositivo a usuario */
  private logicUpdateDevice(serial: string, alias: string): void{
    this.loading.show();                          // Muestra loading
    this.devicesService.updateUserDevice(serial, alias).pipe(takeUntil(this.destroy$)).subscribe(  // Petición de asignar
      (data: ResponseModel) => {                             // Recepción correcta
        this.loading.close();                                // Cierra el Loading
        this.snack.show('success',                           // Muestra notificacion de agregado correctamente
          'Dispositivo actualizado correctamente!!!',
          'top', 'center'
        );
        this.refreshData();    // Actualiza tabla
      },
      (err: HttpErrorResponse) => {                               // Error de recepción
        this.loading.close();                                     // Cierra el Loading
        this.snack.show('danger', 'Error', 'top', 'rigth');       // Muestra notificación de error
        this.triggerErrorDialog(err.error?.errors || [{msg: 'Error inesperado'}] , 'Error al agregar dispositivo');
      }
    );
  }
  /* --------------------------------------- */

  /** Lógica para asignar dispositivo a usuario */
  private logicDeleteDevice(serial: string): void{
    this.loading.show();                          // Muestra loading
    this.devicesService.deleteUserDevice(serial).pipe(takeUntil(this.destroy$)).subscribe(  // Petición de asignar
      (data: ResponseModel) => {                             // Recepción correcta
        this.loading.close();                                // Cierra el Loading
        this.snack.show('success',                           // Muestra notificacion de borrado correctamente
          'Dispositivo borrado correctamente!!!',
          'top', 'center'
        );
        this.refreshData();    // Actualiza tabla
      },
      (err: HttpErrorResponse) => {                               // Error de recepción
        this.loading.close();                                     // Cierra el Loading
        this.snack.show('danger', 'Error', 'top', 'rigth');       // Muestra notificación de error
        this.triggerErrorDialog(err.error?.errors || [{msg: 'Error inesperado'}] , 'Error al agregar dispositivo');
      }
    );
  }
  /* --------------------------------------- */

  /** Lógica para asignar dispositivo a usuario */
  private logicSomeDevices(devices: string[]): void{
    this.loading.show();                          // Muestra loading
    this.devicesService.deleteUserSomeDevices(devices).pipe(takeUntil(this.destroy$)).subscribe(  // Petición de borrar dispositivos
      (data: ResponseModel) => {                             // Recepción correcta
        this.loading.close();                                // Cierra el Loading
        this.snack.show('success',                           // Muestra notificacion de borrados correctamente
          'Dispositivos borrados correctamente!!!',
          'top', 'center'
        );
        this.refreshData();    // Actualiza tabla
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
      data: { errors, title }
    });
  }
  /* --------------------------------------- */

}
