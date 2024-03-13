import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';
import { DevicesTableService } from './devices-table.service';
import { Subject, fromEvent } from 'rxjs';
import { DevicesTableDataSource } from './devices-table.datasource';
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
import { DeviceTableRowModel } from './devices-table.model';
import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent } from '../../../shared/dialogs/error-dialog/error-dialog.component';
import { ErrorModel } from '../../../../global/models/back-end.models';
import { AddDeviceDialogComponent } from './dialogs/add-device-dialog/add-device-dialog.component';
import { PermissiveDialogComponent } from '../../../shared/dialogs/permissive-dialog/permissive-dialog.component';
import { UntypedFormGroup } from '@angular/forms';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-devices-table',
  templateUrl: './devices-table.component.html',
  styleUrls: ['./devices-table.component.scss']
})
export class DevicesTableComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject(); // Observable para acciones de destroy
  dataSource!: DevicesTableDataSource; // Fuente de datos
  private deviceTypes: any[] = [];  // Lista de dispositivos

  @Input() displayedColumns = [   // Columnas a mostrar
    'serial',
    'alias',
    'macid',
    'fwVersion',
    'hwVersion',
    'state',
    'assigned',
    'type',
    'createdAt',
    'updatedAt',
    'actions'
  ];

  @Input() userId = 0;    // Variable para determinar tipo de solicitud a api '' para todos

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; // Obtiene referencia de paginador
  @ViewChild(MatSort, { static: true }) sort!: MatSort; // Obtiene referencia de ordenador
  @ViewChild('filter', { static: true }) filter!: ElementRef; // Obtiene referencia del buscador
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger; // Obtiene referencia del menú de contexto
  selection = new SelectionModel<DeviceTableRowModel>(true, []); // Arreglo para multiple selección
  contextMenuPosition = { x: '0px', y: '0px' }; // Establece posicion de menú de contexto

  constructor(
    public router: Router,
    private loading: LoadingDialogService, // Servicio de dialog loaging personalizado
    private tableService: DevicesTableService, // Servicio para tabla
    private adminService: AdminService,        // Servicio de admin
    public snack: SnackBarService, // Servicio de snack bar personalizado
    public dialog: MatDialog // Para uso de Dialogs
  ) {}

  /** Ciclo de vide de Inicio */
  ngOnInit(): void {
    this.dataSource = new DevicesTableDataSource(   // Inicializa fuente de datos
      this.tableService,                            // Servicio para data source
      this.paginator,                               // Paginador
      this.sort ,                                   // Ordenador
      this.userId                                   // Tipo de acción a la api
    );

    this.dataSource.errors
    .pipe(takeUntil(this.destroy$))
    .subscribe((error: HttpErrorResponse) => {  // Manejador de errores
      this.triggerErrorDialog(error.error?.errors);                   // Dispara dialog de error
    });

    this.logicGetDeviceTypes();         // Obtiene tipos de dispositivos
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
  addRow(): void {
    const dialogRef = this.dialog.open(AddDeviceDialogComponent, {  // Dialog de agregar
      data: {action: 'add' , types: this.deviceTypes }
    });

    dialogRef.afterClosed().subscribe((result) => {        // Al cerrarse el dialog
      if (result) {                                        // Se se cerro correctamente
        this.logicAddDevice(result.type, result.alias);
      }
    });
  }
  /* --------------------------------------- */

  /** Edita alias de dispositivo  */
  editRow(row: DeviceTableRowModel): void {
    const dialogRef = this.dialog.open(AddDeviceDialogComponent, {  // Dialog de agregar
      data: {action: 'edit' , device: row, types: this.deviceTypes }
    });

    dialogRef.afterClosed().subscribe((result) => {        // Al cerrarse el dialog
      if (result) {                                        // Se se cerro correctamente
        this.logicUpdateDevice(row.serial, result.type, result.alias);
      }
    });
  }
  /* --------------------------------------- */

  /** Borra un dispositivo */
  deleteRow(row: DeviceTableRowModel): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {  // Dialog de confirmar
      data: { title: '¿Esta seguro?', type: 'warn',
      text: 'Se borrará el siguiente firmware',
      items: [{name: row.serial, value: row.alias}] }
    });

    dialogRef.afterClosed().subscribe(async (result) => {   // Al cerrarse el dialog
      if (result) {                                   // Se se cerro correctamente
        const {password} = await this.triggerDeleteDialog('borrar-dispositivo');
        if (password){
          this.logicPermissive(password, row);
        }
      }
    });
  }
  /* --------------------------------------- */

  /** Direcciona a componente de dispositivo */
  reviewRow(row: DeviceTableRowModel): void {
    this.router.navigate([`app/devices/${row.type.toLowerCase()}/${row.serial}`]);
  }
  /* --------------------------------------- */

  /** Direcciona a componente de  detalles de dispositivo */
  detailsRow(row: DeviceTableRowModel): void {
    this.router.navigate([`app/admin/devices/details/${row.serial}`]);
  }
  /* --------------------------------------- */

  /** Actualiza tabla */
  refreshData(): void {
    this.dataSource.getDataFromService();
    this.selection = new SelectionModel<DeviceTableRowModel>(true, []);    // Reestablece seleccionado
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

  /** Lógica para agregar firmware */
  private logicAddDevice(type: string, alias: string): void{
    this.loading.show();                                 // Muestra loading
    this.tableService.addDevice(type, alias)                   // Petición
      .pipe(takeUntil(this.destroy$))
      .subscribe(
      (data) => {                             // Recepción correcta
        this.loading.close();                                // Cierra el Loading
        this.snack.show('success',                           // Muestra notificacion de borrado correctamente
          'Dispositivo agregado correctamente!!!',
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

  /** Lógica para actualizar firmware */
  private logicUpdateDevice(serial: string, type: string, alias: string): void{
    this.loading.show();                                 // Muestra loading
    this.tableService.updateDevice(serial, type, alias)                   // Petición
      .pipe(takeUntil(this.destroy$))
      .subscribe(
      (data) => {                             // Recepción correcta
        this.loading.close();                                // Cierra el Loading
        this.snack.show('success',                           // Muestra notificacion de borrado correctamente
          'Dispositivo actualizado correctamente!!!',
          'top', 'center'
        );
        this.refreshData();    // Actualiza tabla
      },
      (err: HttpErrorResponse) => {                               // Error de recepción
        this.loading.close();                                     // Cierra el Loading
        this.snack.show('danger', 'Error', 'top', 'rigth');       // Muestra notificación de error
        this.triggerErrorDialog(err.error?.errors || [{msg: 'Error inesperado'}] , 'Error al actualizar dispositivo');
      }
    );
  }
  /* --------------------------------------- */

  /** Lógica para actualizar firmware */
  private logicDeleteDevice(serial: string): void{
    this.loading.show();                                 // Muestra loading
    this.tableService.deleteDevice(serial)                   // Petición
      .pipe(takeUntil(this.destroy$))
      .subscribe(
      (data) => {                             // Recepción correcta
        this.loading.close();                                // Cierra el Loading
        this.snack.show('success',                           // Muestra notificacion de borrado correctamente
          'Dispositivo eliminado correctamente!!!',
          'top', 'center'
        );
        this.refreshData();    // Actualiza tabla
      },
      (err: HttpErrorResponse) => {                               // Error de recepción
        this.loading.close();                                     // Cierra el Loading
        this.snack.show('danger', 'Error', 'top', 'rigth');       // Muestra notificación de error
        this.triggerErrorDialog(err.error?.errors || [{msg: 'Error inesperado'}] , 'Error al borrar dispositivo');
      }
    );
  }
  /* --------------------------------------- */

  /** Lógica para adquirir tipos de dispositivo */
  private logicGetDeviceTypes(): void{
    this.loading.show();                                 // Muestra loading
    this.tableService.getDeviceTypes()                   // Petición
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

  /** Dispara dialog de error */
  private triggerErrorDialog(errors: ErrorModel[], title: string = ''): void{
    this.dialog.open(ErrorDialogComponent, {  // Configuracion para dialog de agregar
      maxWidth: '355px',
      data: { errors, title }
    });
  }
  /* --------------------------------------- */

}
