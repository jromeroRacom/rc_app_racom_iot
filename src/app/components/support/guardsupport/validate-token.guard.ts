import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthsupportService } from '../authsupport/authsupport.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ValidateTokenGuard  {

  constructor(
    private authsupportService: AuthsupportService,
    private router: Router
  ){}

  canActivate(): Observable<boolean> | boolean {

    return this.authsupportService.validateToken()
    .pipe(
      tap( valid => {
        if ( !valid ) {
          this.router.navigateByUrl('/support/support-all')
        }
      })
    );
  }
  canLoad(): Observable<boolean> | boolean  {

    return this.authsupportService.validateToken()
    .pipe(
      tap( valid => {
        if ( !valid ) {
          this.router.navigateByUrl('/support/support-all')
        }
      })
    );
  }
}
