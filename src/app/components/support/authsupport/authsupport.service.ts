import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, of } from 'rxjs';

import { AuthSupport, UserSopport } from './interfaces/authSupport';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthsupportService {

  private _userSopport!: UserSopport;

  private url: string = environment.apiHostSupport;     // Host
  private port: number = environment.apiPortSupport;  //Port
  private apiPath: string = environment.apiPathSupport //Path
  private apiUrl: string;

  get userSupport() {
    return { ...this._userSopport };
  }

  constructor(
    private http: HttpClient
  ) {
    this.apiUrl = `${this.url}:${this.port}/${this.apiPath}`
  }

    /******************* APIS  *******************/

  /** API de registro de usuarios */
  register( name: string, email: string, password: string  ){
    return this.http.post<AuthSupport>(`${this.apiUrl}/auth/new`, { name, email, password }).pipe( tap( resp => {
      if( resp.ok ){
        localStorage.setItem('token', resp.token!)}
      }), map( resp => resp.ok ),
    catchError( err => of( err.error.msg ) ));
  }

  /** API login de Usuario Support*/
  login(email: string , password: string){
    return this.http.post<AuthSupport>(`${this.apiUrl}/auth`, {email, password}).pipe( tap( resp => {
      if( resp.ok ){
        localStorage.setItem('token', resp.token!)
      }
    }), map( resp => resp.ok ),
    catchError( err => of( err.error.msg ) ));
  };


  /** API de validar usuario */
  validateToken(): Observable<boolean>{
    const urls = `${this.apiUrl}/auth/renew`;
    const headers = new HttpHeaders().set('x-token', localStorage.getItem('token') || '');

    return this.http.get<AuthSupport>( urls, { headers } )
    .pipe(map( resp =>  {
      localStorage.setItem('token', resp.token!)
      this._userSopport = {
        name: resp.name!,
        uid: resp.uid!,
        email: resp.email!,
      }
      return resp.ok;
      }),
      catchError( err => of(false) )
    );
  };

  logout(){
    localStorage.clear();
  }


}
