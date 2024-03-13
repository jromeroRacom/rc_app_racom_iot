import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FirmwaresTableService } from './firmwares-table.service';
import { Subject, fromEvent } from 'rxjs';
import { FirmwaresTableDataSource } from './firmwares-table.datasource';
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
import { FirmwareTableModel } from './firmwares-table.model';
import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent } from '../../../shared/dialogs/error-dialog/error-dialog.component';
import { ErrorModel, ResponseModel } from '../../../../global/models/back-end.models';
import { AddFirmwareDialogComponent } from './dialogs/add-firmware-dialog/add-firmware-dialog.component';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-firmwares-table',
  templateUrl: './firmwares-table.component.html',
  styleUrls: ['./firmwares-table.component.scss']
})
export class FirmwaresTableComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject(); // Observable para acciones de destroy
  private deviceTypes: any[] = [];  // Lista de dispositivos
  dataSource!: FirmwaresTableDataSource; // Fuente de datos
  displayedColumns = [
    'img',
    'type',
    'version',
    'createdAt',
    'updatedAt',
    'actions'
  ]; // Columnas a mostrar

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; // Obtiene referencia de paginador
  @ViewChild(MatSort, { static: true }) sort!: MatSort; // Obtiene referencia de ordenador
  @ViewChild('filter', { static: true }) filter!: ElementRef; // Obtiene referencia del buscador
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger; // Obtiene referencia del menú de contexto
  contextMenuPosition = { x: '0px', y: '0px' }; // Establece posicion de menú de contexto

  constructor(
    public router: Router,
    private loading: LoadingDialogService, // Servicio de dialog loaging personalizado
    private tableService: FirmwaresTableService, // Servicio para tabla
    public snack: SnackBarService, // Servicio de snack bar personalizado
    public dialog: MatDialog // Para uso de Dialogs
  ) {}

  /** Ciclo de vide de Inicio */
  ngOnInit(): void {
    this.dataSource = new FirmwaresTableDataSource(   // Inicializa fuente de datos
      this.tableService,                              // Servicio para data source
      this.paginator,                                   // Paginador
      this.sort                                         // Ordenador
    );

    this.dataSource.errors
    .pipe(takeUntil(this.destroy$))
    .subscribe((error: HttpErrorResponse) => {  // Manejador de errores
      this.triggerErrorDialog(error.error?.errors);                   // Dispara dialog de error
    });

    this.logicGetDeviceTypes();         // Obtiene tipos de firmware
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
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }
  /* --------------------------------------- */

  /** Agregar un nuevo dispositivo */
  addRow(): void {
    const dialogRef = this.dialog.open(AddFirmwareDialogComponent, {  // Dialog de agregar
      data: { types: this.deviceTypes }
    });

    dialogRef.afterClosed().subscribe((result: UntypedFormGroup) => {        // Al cerrarse el dialog
      if (result) {                                        // Se se cerro correctamente
        this.logicUploadFirmware(result);
      }
    });
  }
  /* --------------------------------------- */

  /** Edita alias de dispositivo  */
  dowloadFirmware(row: FirmwareTableModel): void {
    this.logicDowloadFirmware(row.type, row.version);
  }
  /* --------------------------------------- */

  /** Borra un dispositivo */
  deleteRow(row: FirmwareTableModel): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {  // Dialog de confirmar
      data: { title: '¿Esta seguro?', type: 'warn',
      text: 'Se borrará el siguiente firmware',
      items: [{name: row.type, value: row.version}] }
    });

    dialogRef.afterClosed().subscribe((result) => {        // Al cerrarse el dialog
      if (result) {                                        // Se se cerro correctamente
        this.logicDeleteFirmware(row.type, row.version);   // Logica de borrar firmware
      }
    });
  }
  /* --------------------------------------- */

  /** Actualiza tabla */
  refreshData(): void {
    this.dataSource.getDataFromService();
  }
  /* --------------------------------------- */

  /** Lógica para eliminar firmware */
  private logicDeleteFirmware(type: string, version: string): void{
    this.loading.show();                                 // Muestra loading
    this.tableService.deleteFimware(type, version)       // Petición
      .pipe(takeUntil(this.destroy$))
      .subscribe(
      (data: ResponseModel) => {                             // Recepción correcta
        this.loading.close();                                // Cierra el Loading
        this.snack.show('success',                           // Muestra notificacion de borrado correctamente
          'Firmware borrado correctamente!!!',
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

  /** Lógica para descargar firmware */
  private logicDowloadFirmware(type: string, version: string): void{
    this.loading.show();                                 // Muestra loading
    this.tableService.dowloadFimware(type, version)       // Petición
      .pipe(takeUntil(this.destroy$))
      .subscribe(
      (dowload) => {                             // Recepción correcta
        this.loading.close();                                // Cierra el Loading

        const  newBlob = new Blob([dowload], { type: 'application/octet-stream' });

        // if (window.navigator && window.navigator.msSaveOrOpenBlob) { //NO COMPATIBLE CON ANGULAR 13
        //     window.navigator.msSaveOrOpenBlob(newBlob);
        //     return;
        // }

        const data = window.URL.createObjectURL(newBlob);
        const link = document.createElement('a');
        link.href = data;
        link.download = `${type}_${version}.bin`;
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

        setTimeout(() => {
            window.URL.revokeObjectURL(data);
            link.remove();
          }, 100);

        this.snack.show('success',                           // Muestra notificacion de borrado correctamente
          'Firmware descargado correctamente!!!',
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

  /** Lógica para subir firmware */
  private logicUploadFirmware(form: UntypedFormGroup): void{
    this.loading.show();                                 // Muestra loading
    const formData = new FormData();
    formData.append('file', form.get('fileSource')?.value);
    formData.append('type', form.get('type')?.value);
    formData.append('version', form.get('version')?.value);

    this.tableService.uploadFimware(formData)       // Petición
      .pipe(takeUntil(this.destroy$))
      .subscribe(
      (data: ResponseModel) => {                             // Recepción correcta
        this.loading.close();                                // Cierra el Loading
        this.snack.show('success',                           // Muestra notificacion de borrado correctamente
          'Subido correctamente!!!',
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

  /** Lógica para eliminar firmware */
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
        this.triggerErrorDialog(err.error?.errors || [{msg: 'Error inesperado'}] , 'Error al agregar dispositivo');
      }
    );
  }
  /* --------------------------------------- */



  /** Cobfiguración de menú de contexto */
  onContextMenu(event: MouseEvent, item: FirmwareTableModel): void {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
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
