import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { ApiUsersService } from '../../../services/api-users.service';
import { AuthService } from '../auth.service';
import { SnackBarService } from '../../../global/services/snack-bar.service';
import { ErrorsModel, ResponseModel } from '../../../global/models/back-end.models';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-validate-change',
  templateUrl: './validate-change.component.html',
  styleUrls: ['./validate-change.component.scss']
})
export class ValidateChangeComponent implements OnInit {
  public listErrors = new ErrorsModel();       // Lista de errores
  private destroy$ = new Subject();            // Observable para acciones de destroy
  loading: boolean;                            // Bandera para logging con spinner
  submitted: boolean;                          // Bandera de submitted
  tokenValidate: string ;                      // Token de verificación
  error: boolean;                              // Bandera de error
  msg: string;                                 // Mensaje de correcto

  /** Constructor */
  constructor(
    private route: ActivatedRoute,          // Manejo de ruta actual
    private router: Router,                 // Manejo de rutas
    private authService: AuthService,       // Servicio de auth
    public snack: SnackBarService,          // Servicio de snack bar personalizado

  ) {
    this.loading = false;
    this.tokenValidate = '';
    this.error = false;
    this.msg = '';
    this.submitted = false;
  }
  /* --------------------------------------- */

   /** Ciclo de vide de Inicio */
   ngOnInit(): void {
    this.loading = true;                                                       // Pone loading
    this.tokenValidate = this.route.snapshot.paramMap.get('token') || 'none';  // Obtiene token de url

    this.authService.validateChangeUser( this.tokenValidate).pipe(takeUntil(this.destroy$)).subscribe(  // Petición a validar usuario
      (data: ResponseModel) => {                             // Recepción correcta
        this.loading = false;                                // Cierra el Loading
        this.snack.show('success', 'Usuario validado', 'top', 'center'); // Muestra snack de correcto
        this.msg = data.msg || 'Correcto';                               // Mensaje de correcto
        this.submitted = true;                                           // bandera se submitted
        timer(3000).subscribe(val => {this.router.navigateByUrl('/auth/signin'); });  // Direcciona a login
      },
      (err: HttpErrorResponse) => {
        this.error = true;                                        // Bandera de error
        this.loading = false;                                     // Cierra el Loading
        this.snack.show('danger', 'Error', 'top', 'rigth');       // Muestra notificación de error
        this.listErrors = err.error;                              // Pone errores para mostrar
      }
    );
  }
  /* --------------------------------------- */
}
