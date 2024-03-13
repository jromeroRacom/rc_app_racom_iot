import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DevicesTypesTableService } from './devices-types-table.service';
import { Subject, fromEvent } from 'rxjs';
import { DevicesTypesTableDataSource } from './devices-types-table.datasource';
import { SelectionModel } from '@angular/cdk/collections';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoadingDialogService } from 'src/app/global/services/loading-dialog.service';
import { SnackBarService } from 'src/app/global/services/snack-bar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { DevicesTypesTableModel } from './devices-types-table.model';
import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent } from '../../../shared/dialogs/error-dialog/error-dialog.component';
import { ErrorModel } from '../../../../global/models/back-end.models';
import { AddDeviceTypeDialogComponent } from './dialogs/add-device-type-dialog/add-device-type-dialog.component';


@Component({
  selector: 'app-devices-types-table',
  templateUrl: './devices-types-table.component.html',
  styleUrls: ['./devices-types-table.component.scss']
})
export class DevicesTypesTableComponent implements OnInit,  OnDestroy, AfterViewInit {

  private destroy$ = new Subject(); // Observable para acciones de destroy
  dataSource!: DevicesTypesTableDataSource; // Fuente de datos
  displayedColumns = [
    'img',
    'type',
    'actions'
  ]; // Columnas a mostrar

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; // Obtiene referencia de paginador
  @ViewChild(MatSort, { static: true }) sort!: MatSort; // Obtiene referencia de ordenador
  @ViewChild('filter', { static: true }) filter!: ElementRef; // Obtiene referencia del buscador
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger; // Obtiene referencia del menú de contexto
  selection = new SelectionModel<DevicesTypesTableModel>(true, []); // Arreglo para multiple selección
  contextMenuPosition = { x: '0px', y: '0px' }; // Establece posicion de menú de contexto

  constructor(
    public router: Router,
    private loading: LoadingDialogService, // Servicio de dialog loaging personalizado
    private tableService: DevicesTypesTableService, // Servicio para tabla
    public snack: SnackBarService, // Servicio de snack bar personalizado
    public dialog: MatDialog // Para uso de Dialogs
  ) {}

  /** Ciclo de vide de Inicio */
  ngOnInit(): void {
    this.dataSource = new DevicesTypesTableDataSource(   // Inicializa fuente de datos
      this.tableService,                              // Servicio para data source
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
      this.selection = new SelectionModel<DevicesTypesTableModel>(true, []);    // Reestablece seleccionado
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }
  /* --------------------------------------- */

  /** Agregar un nuevo dispositivo */
  addRow(): void {
    const dialogRef = this.dialog.open(AddDeviceTypeDialogComponent, { // Dialog de agregar
      maxWidth: '355px',
      data: { action: 'add' }
    });

    dialogRef.afterClosed().subscribe((result) => {   // Al cerrarse el dialog
      if (result) {                                   // Se se cerro correctamente
        this.logicAddDeviceType(result.type);
      }
    });
  }
  /* --------------------------------------- */

  /** Edita alias de dispositivo  */
  editRow(row: DevicesTypesTableModel): void {
    const dialogRef = this.dialog.open(AddDeviceTypeDialogComponent, { // Dialog de agregar
      maxWidth: '355px',
      data: { deviceType: { type: row.type }, action: 'edit' },
    });

    dialogRef.afterClosed().subscribe((result) => {   // Al cerrarse el dialog
      if (result) {                                   // Se se cerro correctamente
        this.logicUpdateDeviceType(row.type, result.type);
      }
    });
  }
  /* --------------------------------------- */

  /** Borra un dispositivo */
  deleteRow(row: DevicesTypesTableModel): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {  // Dialog de confirmar
      maxWidth: '355px',
      data: { title: '¿Esta seguro?', type: 'warn',
      text: 'Se borrará el siguiente tipo de dispositivo',
      items: [{name: row.type.toUpperCase(), value: ''}] }
    });

    dialogRef.afterClosed().subscribe((result) => {   // Al cerrarse el dialog
      if (result) {                                   // Se se cerro correctamente
        this.logicDeleteDeviceType(row.type);
      }
    });
  }
  /* --------------------------------------- */

  /** Actualiza tabla */
  refreshData(): void {
    this.dataSource.getDataFromService();
    this.selection = new SelectionModel<DevicesTypesTableModel>(true, []);    // Reestablece seleccionado
  }
  /* --------------------------------------- */

  /** Configuración de menú de contexto */
  onContextMenu(event: MouseEvent, item: DevicesTypesTableModel): void {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  /* --------------------------------------- */

  /** Lógica para crear tipo de dispositivo */
  private logicAddDeviceType(type: string): void{
    this.loading.show();                                 // Muestra loading
    this.tableService.addDeviceType(type)               // Petición
      .pipe(takeUntil(this.destroy$))
      .subscribe(
      (data) => {                             // Recepción correcta
        this.loading.close();                                // Cierra el Loading
        this.snack.show('success',                           // Muestra notificacion de borrado correctamente
          'Tipo de dispositivo agregado correctamente!!!',
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

  /** Lógica para actualizar tipo de dispositivo */
  private logicUpdateDeviceType(type: string, ntype: string): void{
    this.loading.show();                                 // Muestra loading
    this.tableService.updateDeviceType(type, ntype)               // Petición
      .pipe(takeUntil(this.destroy$))
      .subscribe(
      (data) => {                             // Recepción correcta
        this.loading.close();                                // Cierra el Loading
        this.snack.show('success',                           // Muestra notificacion de borrado correctamente
          'Tipo de dispositivo actualizado correctamente!!!',
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

  /** Lógica para actualizar tipo de dispositivo */
  private logicDeleteDeviceType(type: string): void{
    this.loading.show();                                 // Muestra loading
    this.tableService.deleteDeviceType(type)               // Petición
      .pipe(takeUntil(this.destroy$))
      .subscribe(
      (data) => {                             // Recepción correcta
        this.loading.close();                                // Cierra el Loading
        this.snack.show('success',                           // Muestra notificacion de borrado correctamente
          'Tipo de dispositivo borrado correctamente!!!',
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
