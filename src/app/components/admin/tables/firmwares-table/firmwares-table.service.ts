import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirmwaresTableService {

  private url: string = environment.apiHost;     // Host
  private port: number = environment.apiPort;    // Puerto
  private apiPath: string = environment.apiPath; // Path
  private apiUri: string;                       // String para hacer url completa

  /** Constructor */
  constructor(private http: HttpClient) {
    this.apiUri = `${this.url}:${this.port}/${this.apiPath}`; // Crea URL
  }
  /* --------------------------------------- */

  /**
   * @note NOTA IMPORTANTE
   * Decidí que para la tabla de firmwares se haría todo el render desde el cliente
   * dado NO SE DEBERÍA tener más de 5 firmwares por tipo de dispositivo, por lo cual
   * no sería eficaz estar haciendo peticiones al servidor cuando se solicita un filtro, sort,
   * o un cambio de página del paginador.
   *
   */

  /******************* APIS  *******************/

  /** API de obtener lista de firmwares */
  getFirmwares(): Observable<any> {
    return this.http.get(`${this.apiUri}/files/ota/list`, {
      params: new HttpParams()
        .set('offset', '0')
        .set('limit', '1000')                 // Obtiene todos los firmwares (ver nota de arriba)
    });
  }
  /* --------------------------------------- */

  /** API de borrar firmware */
  deleteFimware(type: string, version: string): Observable<any> {
    return this.http.delete(`${this.apiUri}/files/ota/${type}/${version}`);
  }
  /* --------------------------------------- */

  /** API de descargar firmware */
  dowloadFimware(type: string, version: string): Observable<any> {
    const httpOptions = {
      responseType: 'blob' as 'json'
    };
    return this.http.get(`${this.apiUri}/files/ota/${type}/${version}`, httpOptions);
  }
  /* --------------------------------------- */

   /** API de descargar firmware */
   uploadFimware(file: FormData): Observable<any> {
    return this.http.post(`${this.apiUri}/files/ota`, file);
  }

  /** API de obtener lista de tipos de dispositivod */
  getDeviceTypes(): Observable<any> {
    return this.http.get(`${this.apiUri}/devices/types/get-all`, {
      params: new HttpParams()
        .set('offset', '0')
        .set('limit', '1000')
    });
  }
  /* --------------------------------------- */
}
