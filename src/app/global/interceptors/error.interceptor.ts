import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';
import { ErrorsModel } from '../models/back-end.models';
import { concatMap, delay, retryWhen } from 'rxjs/operators';
import { Router } from '@angular/router';
import { EventsSessionService, SessionEvent } from '../services/events-session.service';
import { environment } from '../../../environments/environment';


const retryCount = 3;                 // Número de reintentos
const retryWaitMilliSeconds = 1000;   // Retardo entre peticiones
const timeoutSeconds = environment.httpTimeoutMs;     // Timeout de peticiones

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private sessionEventsService: EventsSessionService, // Servicio de eventos
    ) {}

  intercept( request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      timeout(timeoutSeconds),             // Timeout de request
      retryWhen(error =>                   // Logica de reintentos
        error.pipe(
          concatMap((err, count) => {
            if (count < retryCount &&  (err.statusText === 'Unknown Error' || err.status === 500 || !err.status )) {
              return of(err);
            }
            return throwError(err);
          }),
          delay(retryWaitMilliSeconds)   // Tiempo entre peticiones
        )
      ),
      catchError((err) => {          // Obtiene error
        const error: ErrorsModel = err.error;   // Obtiene referencia de errores

        if (err.status === 500){         // Error en servidor
          error.ok = false;              // pone ok en falso
          error.errors = [{ msg: 'Error interno en servidor, por favor comuniquese con su proveedor'}];  // Error legible
        }

        if (err.status === 404) {        // Error de no encontrado
          const newErr = {               // Crea objeto de error
            error: {
              ok: false,
              errors: [{ msg: 'No se encontró la ruta especificada, por favor comuniquese con su proveedor'}]
            }
          };

          return throwError(newErr);  // Retorna error
        }

        if (err.status === 401) {
          error.ok = false;              // pone ok en falso
          error.errors = [{ msg: 'Usuario no valido'}];  // Error de usuario no valido

          const data = new SessionEvent();            // Pone evento de no autorizado
          data.origin = 'interceptor';                // Pone origen
          data.type = '401';                      // Evento de expiraion
          this.sessionEventsService.addSessionEvent(data);  // Pone evento en servicio

          this.router.navigate(['/auth/signin']);
        }

        if (error?.ok === undefined){     // Si no viene ok
          error.ok = false;              // pone ok en falso
          error.errors = [{ msg: 'Error inesperado, por favor comuniquese con su proveedor'}];  // Error legible
        }

        return throwError(err);  // Retorna error
      })
    );
  }
}
