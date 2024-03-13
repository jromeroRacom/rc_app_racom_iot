import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EventsSessionService } from '../services/events-session.service';
import { AuthTokenService } from '../services/auth-token.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard  {
  constructor(
    private sessionEventsService: EventsSessionService, // Servicio de eventos
    private router: Router,                             // Rutas
    private authService: AuthTokenService) {}           // Servicio de autenticación

  canActivate(): boolean {                                        // Permisivo para activar ruta
    if (this.authService.getRolFromToken() === 'ADMIN_ROLE') {    // Obtiene rol de token
      return true;                                                // Permite acceso
    }

    this.router.navigate(['/app/home']);       // Dirige a main
    return false;                               // Impide activación
  }

  canLoad(): boolean {                            // Permisivo para cargar ruta
    if (this.authService.getRolFromToken() === 'ADMIN_ROLE') {    // Obtiene rol de token
      return true;                                                // Permite acceso
    }

    this.router.navigate(['/app/home']);       // Dirige a main
    return false;                               // Impide activación
  }

}
