import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

import { CuestionsAll } from './interfaces/cuestionsAll';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

  private url: string = environment.apiHostSupport;     // Host
  private port: number = environment.apiPortSupport;  //Port
  private apiPath: string = environment.apiPathSupport //Path
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${this.url}:${this.port}/${this.apiPath}`
  }

  /******************* APIS  *******************/

  /** API de obtener preguntas y respuestas */
  getSupport(): Observable<CuestionsAll[]>{
    return this.http.get<CuestionsAll[]>(`${this.apiUrl}/support/support-all`);
  }

  /* --------------------------------------- */

  /** API de obtener preguntas y respuestas por id */
  getSupportId( id: string ): Observable<CuestionsAll>{
    return this.http.get<CuestionsAll>(`${this.apiUrl}/support/support-all/${id}`);
  }

  /* --------------------------------------- */

  /** API de obtener preguntas y respuestas por consulta */
  getSugerencias( termino: string ): Observable<CuestionsAll[]>{
    return this.http.get<CuestionsAll[]>(`${this.apiUrl}/support/support-all?q=${termino}`);
  }
}
