import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Event, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PlatformLocation } from '@angular/common';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private history: string[] = [];
  private currentUrl = '';
  private navigation$!: Subscription;

  /** Constructor */
  constructor(
    private router: Router,                        // Manejo de rutas
    private platformLocation: PlatformLocation,    // Manejo de DOM
    private spinner: NgxSpinnerService             // Servicio de spinner
  ) {}
  /* --------------------------------------- */

  /** Inicializa eventos de navegación */
  init(): void {
    if (!this.navigation$) {                            // Si no se ha inicializado
      this.navigation$ = this.router.events             // Se suscribe a los eventos del router
      .subscribe((routerEvent: Event) => {
        if (routerEvent instanceof NavigationStart) {   // Si es el inicio de la ruta
          this.spinner.show();                          // Pone page-loader
          this.platformLocation.onPopState(() => {
            window.location.reload();
          });
          // console.log(routerEvent.url);             // Sirve para probar rutas
          this.currentUrl = routerEvent.url;           // Obtiene url actual
        }
        if (routerEvent instanceof NavigationEnd) {    // Si es el final de la ruta
          this.spinner.hide();                         // Quita page loader
          if (this.history.length >= 20) {             // Si ya llegó al maximo de historicos
            this.history.shift();                      // Quita el primero
          }
          if (                                          // Si la ruta anterior es diferente a la actual
            this.history[this.history.length - 1] !==
            routerEvent.urlAfterRedirects
          ) {
            this.history.push(routerEvent.urlAfterRedirects);    // Pone en historico
          }
        }
        // window.scrollTo(0, 0);
      });
    }
  }
  /* --------------------------------------- */

  /** Resetea historico de rutas */
  resetHistory(): void {
    this.history = [];
  }
  /* --------------------------------------- */

  /** Borra subscripciones */
  destroy(): void {
    if (this.navigation$) {
      this.navigation$.unsubscribe();
    }
  }
  /* --------------------------------------- */

  /** Logica para regresar a ruta anterior */
  back(): void {
    this.history.pop();              // Quita ruta actual
    if (this.history.length > 0) {   // Si hay historico
      this.router.navigateByUrl(this.history[this.history.length - 1]);  // Regresa a la anterior
    } else {
      this.router.navigateByUrl('/');      // Si no hay historico regresa al main
    }
  }
  /* --------------------------------------- */
}
