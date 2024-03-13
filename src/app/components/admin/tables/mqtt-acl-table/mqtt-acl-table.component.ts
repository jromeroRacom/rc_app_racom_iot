import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MqttAclTableService } from './mqtt-acl-table.service';
import { Subject, fromEvent } from 'rxjs';
import { MqttAclTableDataSource } from './mqtt-acl-table.datasource';
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
import { MqttAclTableModel } from './mqtt-acl-table.model';
import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent } from '../../../shared/dialogs/error-dialog/error-dialog.component';
import { ErrorModel } from '../../../../global/models/back-end.models';
import { AddMqttAclDialogComponent } from './dialogs/add-mqtt-acl-dialog/add-mqtt-acl-dialog.component';

@Component({
  selector: 'app-mqtt-acl-table',
  templateUrl: './mqtt-acl-table.component.html',
  styleUrls: ['./mqtt-acl-table.component.scss']
})
export class MqttAclTableComponent implements OnInit, OnDestroy, AfterViewInit {

  private destroy$ = new Subject(); // Observable para acciones de destroy
  dataSource!: MqttAclTableDataSource; // Fuente de datos
  displayedColumns = [
    // 'select',
    'allow',
    'access',
    'username',
    'topic',
    'createdAt',
    'updatedAt',
    'actions'
  ]; // Columnas a mostrar

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; // Obtiene referencia de paginador
  @ViewChild(MatSort, { static: true }) sort!: MatSort; // Obtiene referencia de ordenador
  @ViewChild('filter', { static: true }) filter!: ElementRef; // Obtiene referencia del buscador
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger; // Obtiene referencia del menú de contexto
  selection = new SelectionModel<MqttAclTableModel>(true, []); // Arreglo para multiple selección
  contextMenuPosition = { x: '0px', y: '0px' }; // Establece posicion de menú de contexto

  constructor(
    public router: Router,
    private loading: LoadingDialogService, // Servicio de dialog loaging personalizado
    private tableService: MqttAclTableService, // Servicio para tabla
    public snack: SnackBarService, // Servicio de snack bar personalizado
    public dialog: MatDialog // Para uso de Dialogs
  ) {}

  /** Ciclo de vide de Inicio */
  ngOnInit(): void {
    this.dataSource = new MqttAclTableDataSource(   // Inicializa fuente de datos
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
      this.selection = new SelectionModel<MqttAclTableModel>(true, []);    // Reestablece seleccionado
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }
  /* --------------------------------------- */

  /** Agregar un nuevo dispositivo */
  addRow(): void {
  }
  /* --------------------------------------- */

  /** Edita alias de dispositivo  */
  editRow(row: MqttAclTableModel): void {
    const dialogRef = this.dialog.open(AddMqttAclDialogComponent, { // Dialog de agregar
      maxWidth: '355px',
      data: { mqttAcl: row, action: 'edit' },
    });

    dialogRef.afterClosed().subscribe((result) => {   // Al cerrarse el dialog
      if (result) {                                   // Se se cerro correctamente
        this.logicUpdateMqttUser(row.username, result.allow, result.topic, result.access);
      }
    });
  }
  /* --------------------------------------- */

  /** Actualiza tabla */
  refreshData(): void {
    this.dataSource.getDataFromService();
    this.selection = new SelectionModel<MqttAclTableModel>(true, []);    // Reestablece seleccionado
  }
  /* --------------------------------------- */


  /** Cobfiguración de menú de contexto */
  onContextMenu(event: MouseEvent, item: MqttAclTableModel): void {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  /* --------------------------------------- */
  /** Lógica para crear tipo de dispositivo */
  private logicUpdateMqttUser(username: string, allow: boolean, topic: string, access: number): void{
    this.loading.show();                                                // Muestra loading
    this.tableService.updateMqttAcl(username, allow, topic, access)    // Petición
      .pipe(takeUntil(this.destroy$))
      .subscribe(
      (data) => {                             // Recepción correcta
        this.loading.close();                                // Cierra el Loading
        this.snack.show('success',                           // Muestra notificacion de borrado correctamente
          'Acl mqtt actualizado correctamente!!!',
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
