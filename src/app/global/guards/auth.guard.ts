import { Injectable } from '@angular/core';
import { Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthTokenService } from '../services/auth-token.service';
import { EventsSessionService, SessionEvent } from '../services/events-session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(
    private sessionEventsService: EventsSessionService, // Servicio de eventos
    private router: Router,                             // Rutas
    private authService: AuthTokenService) {}           // Servicio de autenticación

  canActivate(): boolean {                        // Permisivo para activar ruta
    if (!this.authService.isTokenExpired()) {     // Si el token sigue siendo valido
      return true;                                // Permite acceso
    }

    if (this.authService.getToken()){             // Si el token existe
      const data = new SessionEvent();            // Pone evento de token expirado
      data.origin = 'guard';                      // Pone origen
      data.type = 'expired';                      // Evento de expiraion
      this.sessionEventsService.addSessionEvent(data);  // Pone evento en servicio
    }

    this.router.navigate(['/auth/signin']);     // Dirige a login
    return false;                               // Impide activación
  }

  canLoad(): boolean {                            // Permisivo para cargar ruta
    if (!this.authService.isTokenExpired()) {     // Si el token sigue siendo valido
      return true;                                // Permite acceso
    }

    if (this.authService.getToken()){             // Si el token existe
      const data = new SessionEvent();            // Pone evento de token expirado
      data.origin = 'guard';                      // Pone origen
      data.type = 'expired';                      // Evento de expiraion
      this.sessionEventsService.addSessionEvent(data);  // Pone evento en servicio
    }

    this.router.navigate(['/auth/signin']);     // Dirige a login
    return false;                               // Impide carga
  }

}
