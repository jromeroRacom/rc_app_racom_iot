import { DeviceModel } from './../../../../global/models/device.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DevicesTableService {
  private url: string = environment.apiHost; // Host
  private port: number = environment.apiPort; // Puerto
  private apiPath: string = environment.apiPath; // Path
  private apiUri: string; // String para hacer url completa

  /** Constructor */
  constructor(private http: HttpClient) {
    this.apiUri = `${this.url}:${this.port}/${this.apiPath}`; // Crea URL
  }
  /* --------------------------------------- */

  /******************* APIS  *******************/

  /** API de login */
  getDevices(
    filter = '',
    sortOrder = 'asc',
    offset = 0,
    limit = 10
  ): Observable<any> {
    return this.http.get(`${this.apiUri}/devices/user/get-all`, {
      params: new HttpParams()
        .set('filter', filter)
        .set('sortOrder', sortOrder)
        .set('offset', offset.toString())
        .set('limit', limit.toString())
    });
  }
  /* --------------------------------------- */
}
