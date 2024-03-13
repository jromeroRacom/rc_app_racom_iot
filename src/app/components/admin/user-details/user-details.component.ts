import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { NavigationService } from '../../../global/services/navigation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersTableModel } from '../tables/users-table/users-table.model';
import { AdminService } from '../admin.service';
import { Subject, interval } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { LoadingDialogService } from '../../../global/services/loading-dialog.service';
import { SnackBarService } from '../../../global/services/snack-bar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorDialogComponent } from '../../shared/dialogs/error-dialog/error-dialog.component';
import { ErrorModel } from '../../../global/models/back-end.models';
import { MatDialog } from '@angular/material/dialog';
import { AddUserDialogComponent } from '../tables/users-table/dialogs/add-user-dialog/add-user-dialog.component';
import { ConfirmDialogComponent } from '../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { PermissiveDialogComponent } from '../../shared/dialogs/permissive-dialog/permissive-dialog.component';
import { UntypedFormGroup } from '@angular/forms';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserDetailsComponent implements OnInit, OnDestroy {

  public id: number | string;                   // Serial de dispositivo
  public user!: UsersTableModel;
  private destroy$ = new Subject(); // Observable para acciones de destroy
  public dataReady = false;   // Bandera para cargar dispositivos
  private roles: any[] = [];  // Lista de roles


  displayedDevicesColumns = [   // Columnas a mostrar de dispositivos
    'serial',
    'alias',
    'macid',
    'fwVersion',
    'hwVersion',
    'type',
    'actions'
  ];

  displayedSessionsColumns = [
    'id',
    'ip',
    'city',
    'start',
    'expiration',
    'actions',
  ];

  constructor(
    private route: ActivatedRoute, // Manejo de ruta activa
    private router: Router, // Menjo de rutas
    public dialog: MatDialog, // Para uso de Dialogs
    private navigation: NavigationService, // Servicio de navegacion
    private loading: LoadingDialogService, // Servicio de dialog loaging personalizado
    public snack: SnackBarService, // Servicio de snack bar personalizado
    private adminService: AdminService    // Servicio de administrador
  ) {
    this.id = this.route.snapshot.paramMap.get('id') || 0; // Obtiene email de url
  }

  ngOnInit(): void {
    this.logicGetUserData();      // Obtiene info de usuaios
  }

  /** Ciclo de vide de Final */
  ngOnDestroy(): void {
    this.destroy$.next();     // Dispara Observable
    this.destroy$.complete(); // Finaliza Observable
  }
  /* --------------------------------------- */

  backClicked(): void {
    this.navigation.back();
  }

  /** Editar usuario */
  public editUser(): void{
    const dialogRef = this.dialog.open(AddUserDialogComponent, {  // Dialog de agregar
      data: {action: 'edit', user: this.user, roles: this.roles }
    });

    dialogRef.afterClosed().subscribe((result) => {        // Al cerrarse el dialog
      if (result) {                                        // Se se cerro correctamente
        this.logicUpdateUser(this.user?.email, result.email, result.name, result.role, result.password || '');
      }
    });

  }

  /** Borrar usuario */
  public deleteUser(): void{
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {  // Dialog de confirmar
      data: { title: '¿Esta seguro?', type: 'warn',
      text: 'Se borrará el siguiente firmware',
      items: [{name: this.user?.name, value: this.user?.email}] }
    });

    dialogRef.afterClosed().subscribe(async (result) => {   // Al cerrarse el dialog
      if (result) {                                   // Se se cerro correctamente
        const {password} = await this.triggerDeleteDialog('borrar-usuario');
        if (password){
          const permisivve = await this.triggerPermisivveApi(password);
          if (permisivve){
            this.logicDeleteUser(this.user?.email);
          }
        }
      }
    });
  }
  /* --------------------------------------- */

  /** Lógica para Obtiene roles */
  private logicGetRoles(): void{
    this.loading.show();                                 // Muestra loading
    this.adminService.getRoles()                   // Petición
      .pipe(takeUntil(this.destroy$))
      .subscribe(
      (data) => {                             // Recepción correcta
        this.loading.close();                                // Cierra el Loading
        data.roles.rows.forEach((element: any) => {          // Obtiene tipos de usuario
          this.roles.push(element.role);
        });
        this.dataReady = true;               // Pone bandera lista
      },
      (err: HttpErrorResponse) => {                               // Error de recepción
        this.loading.close();                                     // Cierra el Loading
        this.snack.show('danger', 'Error', 'top', 'rigth');       // Muestra notificación de error
        this.triggerErrorDialog(err.error?.errors || [{msg: 'Error inesperado'}] , 'Error al obtener tipos de usuarios');
      }
    );
  }
  /* --------------------------------------- */


  /** Lógica para  Obtiene info de usuaios */
  private logicGetUserData(): void{
    this.loading.show();                                 // Muestra loading
    this.adminService.getUserById(Number(this.id))
    .pipe(takeUntil(this.destroy$))
    .subscribe(
    (data) => {                            // Recepción correcta
      this.loading.close();                // Cierra el Loading
      this.user = data.user;               // Obtiene datos de usuario
      this.logicGetRoles();                 // Obtiene roles
    },
    (err: HttpErrorResponse) => {                               // Error de recepción
      this.dataReady = false;
      this.loading.close();                                     // Cierra el Loading
      this.snack.show('danger', 'Error', 'top', 'rigth');       // Muestra notificación de error
      this.triggerErrorDialog(err.error?.errors || [{msg: 'Error inesperado'}] , 'Error al borrar dispositivo');
      interval(3000).pipe(takeUntil(this.destroy$), take(1)).subscribe( (val) => {  // Regresa a lista de usuarios
        this.router.navigate([`app/admin/users/list`]);
      });
    });
  }
  /* --------------------------------------- */


  /** Lógica para agregar usuario */
  private logicUpdateUser(email: string, nemail: string, name: string, role: string, password: string = ''): void{
    this.loading.show();                                 // Muestra loading
    this.adminService.updateUser(email, nemail, name, role, password)                   // Petición
      .pipe(takeUntil(this.destroy$))
      .subscribe(
      (data) => {                             // Recepción correcta
        this.loading.close();                                // Cierra el Loading
        this.snack.show('success',                           // Muestra notificacion de borrado correctamente
          'Usuario actualizado correctamente!!!',
          'top', 'center'
        );
        this.user = data.user;               // Obtiene datos de usuario
      },
      (err: HttpErrorResponse) => {                               // Error de recepción
        this.loading.close();                                     // Cierra el Loading
        this.snack.show('danger', 'Error', 'top', 'rigth');       // Muestra notificación de error
        this.triggerErrorDialog(err.error?.errors || [{msg: 'Error inesperado'}] , 'Error al borrar usuario');
      }
    );
  }
  /* --------------------------------------- */

   /** Lógica para borrar usuario */
   private logicDeleteUser(email: string): void{
    this.loading.show();                                 // Muestra loading
    this.adminService.deleteUser(email)                   // Petición
      .pipe(takeUntil(this.destroy$))
      .subscribe(
      (data) => {                             // Recepción correcta
        this.loading.close();                                // Cierra el Loading
        this.snack.show('success',                           // Muestra notificacion de borrado correctamente
          'Usuario eliminado correctamente!!!',
          'top', 'center'
        );
        this.router.navigate([`app/admin/users/list`]);
      },
      (err: HttpErrorResponse) => {                               // Error de recepción
        this.loading.close();                                     // Cierra el Loading
        this.snack.show('danger', 'Error', 'top', 'rigth');       // Muestra notificación de error
        this.triggerErrorDialog(err.error?.errors || [{msg: 'Error inesperado'}] , 'Error al borrar usuario');
      }
    );
  }
  /* --------------------------------------- */

  /** Lógica para contraseña de permisivo */
  private triggerPermisivveApi(password: string ): Promise<any>{
    const promise = new Promise((resolve, reject) => {
      this.loading.show();                                 // Muestra loading
      this.adminService.validatePermissive(password)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
        (val) => {                             // Recepción correcta
          this.loading.close();                                // Cierra el Loading
          resolve (true) ;
        },
        (err: HttpErrorResponse) => {                               // Error de recepción
          this.loading.close();                                     // Cierra el Loading
          this.snack.show('danger', 'Error', 'top', 'rigth');       // Muestra notificación de error
          this.triggerErrorDialog(err.error?.errors || [{msg: 'Error inesperado'}] , 'Error al permisivo');
          resolve(false);
        }
      );

    });
    return promise;
  }

  /** Hace logica de dialog de borrar */
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
