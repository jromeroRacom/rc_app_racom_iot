import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';


import { AuthTokenService } from '../services/auth-token.service';
import { timeout } from 'rxjs/operators';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private apiKey: string | undefined = environment.apiKey || undefined;   // Apikey

  constructor(private authTokenService: AuthTokenService) {}

  intercept( request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const userToken = this.authTokenService.getToken() || 'none';     // Obtiene token

    if (userToken && this.apiKey ) {              // Si existe el token y apikey
      request = request.clone({
        setHeaders: {                            // Pone headers de auth
          Authorization: `Bearer ${userToken}`,
          'x-apiKey': this.apiKey,
        },
      });
    }

    return next.handle(request);
  }
}
