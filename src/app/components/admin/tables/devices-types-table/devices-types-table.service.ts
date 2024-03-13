import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class DevicesTypesTableService {

  private url: string = environment.apiHost;     // Host
  private port: number = environment.apiPort;    // Puerto
  private apiPath: string = environment.apiPath; // Path
  private apiUri: string;                       // String para hacer url completa

  /** Constructor */
  constructor(private http: HttpClient) {
    this.apiUri = `${this.url}:${this.port}/${this.apiPath}`; // Crea URL
  }
  /* --------------------------------------- */

  /** API de obtener lista de tipos de dispositivos */
  getDeviceTypes(): Observable<any> {
    return this.http.get(`${this.apiUri}/devices/types/get-all`, {
      params: new HttpParams()
        .set('offset', '0')
        .set('limit', '1000')
    });
  }
  /* --------------------------------------- */

  /** API de agregar tipo de dispositivo */
  addDeviceType(type: string): Observable<any> {
    return this.http.post(`${this.apiUri}/devices/types`, { type });
  }
  /* --------------------------------------- */

  /** API de actualizar tipo de dispositivo */
  updateDeviceType(type: string, ntype: string): Observable<any> {
    return this.http.put(`${this.apiUri}/devices/types/${type}`, { ntype });
  }
  /* --------------------------------------- */

  /** API de actualizar tipo de dispositivo */
  deleteDeviceType(type: string): Observable<any> {
    return this.http.delete(`${this.apiUri}/devices/types/${type}`);
  }
  /* --------------------------------------- */
}
