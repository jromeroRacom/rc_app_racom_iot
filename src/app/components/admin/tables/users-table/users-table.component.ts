import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { UsersTableService } from './users-table.service';
import { Subject, fromEvent } from 'rxjs';
import { UsersTableDataSource } from './users-table.datasource';
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
import { UsersTableModel } from './users-table.model';
import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent } from '../../../shared/dialogs/error-dialog/error-dialog.component';
import { ErrorModel } from '../../../../global/models/back-end.models';
import { AddUserDialogComponent } from './dialogs/add-user-dialog/add-user-dialog.component';
import { AdminService } from '../../admin.service';
import { PermissiveDialogComponent } from '../../../shared/dialogs/permissive-dialog/permissive-dialog.component';
import { UntypedFormGroup } from '@angular/forms';
import { UserDevicesTableComponent } from '../../../main/tables/user-devices-table/user-devices-table.component';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit, OnDestroy, AfterViewInit {
  private roles: any[] = []; // Lista de roles
  private destroy$ = new Subject(); // Observable para acciones de destroy
  dataSource!: UsersTableDataSource; // Fuente de datos
  displayedColumns = [
    // 'select',
    'email',
    'name',
    'state',
    'role',
    'createdAt',
    'updatedAt',
    'actions'
  ]; // Columnas a mostrar

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; // Obtiene referencia de paginador
  @ViewChild(MatSort, { static: true }) sort!: MatSort; // Obtiene referencia de ordenador
  @ViewChild('filter', { static: true }) filter!: ElementRef; // Obtiene referencia del buscador
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger; // Obtiene referencia del menú de contexto
  selection = new SelectionModel<UsersTableModel>(true, []); // Arreglo para multiple selección
  contextMenuPosition = { x: '0px', y: '0px' }; // Establece posicion de menú de contexto

  constructor(
    public router: Router,
    private loading: LoadingDialogService, // Servicio de dialog loaging personalizado
    private tableService: UsersTableService, // Servicio para tabla
    private adminService: AdminService, // Servicio de admin
    public snack: SnackBarService, // Servicio de snack bar personalizado
    public dialog: MatDialog // Para uso de Dialogs
  ) {}

  /** Ciclo de vide de Inicio */
  ngOnInit(): void {
    this.dataSource = new UsersTableDataSource( // Inicializa fuente de datos
      this.tableService, // Servicio para data source
      this.paginator, // Paginador
      this.sort // Ordenador
    );

    this.dataSource.errors
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: HttpErrorResponse) => {
        // Manejador de errores
        this.triggerErrorDialog(error.error?.errors); // Dispara dialog de error
      });

    this.logicGetRoles(); // Obtiene roles
  }
  /* --------------------------------------- */

  /** Ciclo de vide de Final */
  ngOnDestroy(): void {
    this.destroy$.next(); // Dispara Observable
    this.destroy$.complete(); // Finaliza Observable
  }
  /* --------------------------------------- */

  /** Ciclo de vide de Despues de iniciar vista */
  ngAfterViewInit(): void {
    fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.selection = new SelectionModel<UsersTableModel>(true, []); // Reestablece seleccionado
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }
  /* --------------------------------------- */

  /** Agregar un nuevo usuario */
  addRow(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      // Dialog de agregar
      data: { action: 'add', roles: this.roles }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Al cerrarse el dialog
      if (result) {
        // Se se cerro correctamente
        this.logicAddUser(
          result.email,
          result.name,
          result.role,
          result.password
        );
      }
    });
  }
  /* --------------------------------------- */

  /** Edita alias de usuario  */
  editRow(row: UsersTableModel): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      // Dialog de agregar
      data: { action: 'edit', user: row, roles: this.roles }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Al cerrarse el dialog
      if (result) {
        // Se se cerro correctamente
        this.logicUpdateUser(
          row.email,
          result.email,
          result.name,
          result.role,
          result.password || '',
          result.state
        );
      }
    });
  }
  /* --------------------------------------- */

  /** Borra un usuario */
  deleteRow(row: UsersTableModel): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      // Dialog de confirmar
      data: {
        title: '¿Esta seguro?',
        type: 'warn',
        text: 'Se borrará el siguiente firmware',
        items: [{ name: row.name, value: row.email }]
      }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      // Al cerrarse el dialog
      if (result) {
        // Se se cerro correctamente
        const { password } = await this.triggerDeleteDialog('borrar-usuario');
        if (password) {
          const permisivve = await this.triggerPermisivveApi(password);
          if (permisivve) {
            this.logicDeleteUser(row.email);
          }
        }
      }
    });
  }
  /* --------------------------------------- */

  /** Direcciona a componente de usuario detalles */
  reviewRow(row: UsersTableModel): void {
    this.router.navigate([`app/admin/users/details/${row.id}`]);
  }
  /* --------------------------------------- */

  /** Actualiza tabla */
  refreshData(): void {
    this.dataSource.getDataFromService();
    this.selection = new SelectionModel<UsersTableModel>(true, []); // Reestablece seleccionado
  }
  /* --------------------------------------- */

  /** Cobfiguración de menú de contexto */
  onContextMenu(event: MouseEvent, item: UsersTableModel): void {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  /* --------------------------------------- */

  /** Lógica para adquirir roles */
  private logicGetRoles(): void {
    this.loading.show(); // Muestra loading
    this.tableService
      .getRoles() // Petición
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          // Recepción correcta
          this.loading.close(); // Cierra el Loading
          data.roles.rows.forEach((element: any) => {
            // Obtiene tipos de usuario
            this.roles.push(element.role);
          });
        },
        (err: HttpErrorResponse) => {
          // Error de recepción
          this.loading.close(); // Cierra el Loading
          this.snack.show('danger', 'Error', 'top', 'rigth'); // Muestra notificación de error
          this.triggerErrorDialog(
            err.error?.errors || [{ msg: 'Error inesperado' }],
            'Error al obtener tipos de usuarios'
          );
        }
      );
  }
  /* --------------------------------------- */

  /** Lógica para agregar usuario */
  private logicAddUser(
    email: string,
    name: string,
    role: string,
    password: string
  ): void {
    this.loading.show(); // Muestra loading
    this.tableService
      .createUser(email, name, role, password) // Petición
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          // Recepción correcta
          this.loading.close(); // Cierra el Loading
          this.snack.show(
            'success', // Muestra notificacion de borrado correctamente
            'Usuario creado correctamente!!!',
            'top',
            'center'
          );
          this.refreshData(); // Actualiza tabla
        },
        (err: HttpErrorResponse) => {
          // Error de recepción
          this.loading.close(); // Cierra el Loading
          this.snack.show('danger', 'Error', 'top', 'rigth'); // Muestra notificación de error
          this.triggerErrorDialog(
            err.error?.errors || [{ msg: 'Error inesperado' }],
            'Error al borrar usuario'
          );
        }
      );
  }
  /* --------------------------------------- */

  /** Lógica para agregar usuario */
  private logicUpdateUser(
    email: string,
    nemail: string,
    name: string,
    role: string,
    password: string = '',
    enable: boolean = true
  ): void {
    this.loading.show(); // Muestra loading
    this.tableService
      .updateUser(email, nemail, name, role, password, enable) // Petición
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          // Recepción correcta
          this.loading.close(); // Cierra el Loading
          this.snack.show(
            'success', // Muestra notificacion de borrado correctamente
            'Usuario actualizado correctamente!!!',
            'top',
            'center'
          );
          this.refreshData(); // Actualiza tabla
        },
        (err: HttpErrorResponse) => {
          // Error de recepción
          this.loading.close(); // Cierra el Loading
          this.snack.show('danger', 'Error', 'top', 'rigth'); // Muestra notificación de error
          this.triggerErrorDialog(
            err.error?.errors || [{ msg: 'Error inesperado' }],
            'Error al borrar usuario'
          );
        }
      );
  }
  /* --------------------------------------- */

  /** Lógica para borrar usuario */
  private logicDeleteUser(email: string): void {
    this.loading.show(); // Muestra loading
    this.tableService
      .deleteUser(email) // Petición
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          // Recepción correcta
          this.loading.close(); // Cierra el Loading
          this.snack.show(
            'success', // Muestra notificacion de borrado correctamente
            'Usuario eliminado correctamente!!!',
            'top',
            'center'
          );
          this.refreshData(); // Actualiza tabla
        },
        (err: HttpErrorResponse) => {
          // Error de recepción
          this.loading.close(); // Cierra el Loading
          this.snack.show('danger', 'Error', 'top', 'rigth'); // Muestra notificación de error
          this.triggerErrorDialog(
            err.error?.errors || [{ msg: 'Error inesperado' }],
            'Error al borrar usuario'
          );
        }
      );
  }
  /* --------------------------------------- */

  /** Lógica para contraseña de permisivo */
  private triggerPermisivveApi(password: string): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      this.loading.show(); // Muestra loading
      this.adminService
        .validatePermissive(password)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (val) => {
            // Recepción correcta
            this.loading.close(); // Cierra el Loading
            resolve(true);
          },
          (err: HttpErrorResponse) => {
            // Error de recepción
            this.loading.close(); // Cierra el Loading
            this.snack.show('danger', 'Error', 'top', 'rigth'); // Muestra notificación de error
            this.triggerErrorDialog(
              err.error?.errors || [{ msg: 'Error inesperado' }],
              'Error al permisivo'
            );
            resolve(false);
          }
        );
    });
    return promise;
  }

  /** Hace logica de dialog de borrar */
  private triggerDeleteDialog(code: string): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(PermissiveDialogComponent, {
        // Dialog de confirmación
        maxWidth: '355px',
        data: { code }
      });

      dialogRef.afterClosed().subscribe((result: UntypedFormGroup) => {
        // Al cerrarse
        if (result) {
          if (!result.invalid) {
            resolve({ password: result.get('password')?.value });
          }
        }
        resolve({ password: '' });
      });
    });
    return promise;
  }
  /* --------------------------------------- */

  /** Dispara dialog de error */
  private triggerErrorDialog(errors: ErrorModel[], title: string = ''): void {
    this.dialog.open(ErrorDialogComponent, {
      // Configuracion para dialog de agregar
      maxWidth: '355px',
      data: { errors, title }
    });
  }
  /* --------------------------------------- */
}
