import { DeviceModel } from './../../../../global/models/device.model';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { DevicesTableService } from './devices-table.service';

export class DeviceTableDataSource implements DataSource<DeviceModel> {
  private devicesSubject = new BehaviorSubject<DeviceModel[]>([]); // Para obtener cambios en dispositivos
  private loadingSubject = new BehaviorSubject<boolean>(false); // Para logica de loading de tabla
  public loading$ = this.loadingSubject.asObservable(); // Observable de loading
  public dataleng = 0;

  constructor(private devicesService: DevicesTableService) {}

  getDevicesFromService( filter: string, sortOrder: string, offset: number, limit: number): void {
    this.loadingSubject.next(true);

    this.devicesService
      .getDevices( filter, sortOrder, offset, limit)
      .pipe(
        catchError(() => {
          this.dataleng = 0;
          return of([]);
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((lessons) => {
        this.dataleng = lessons.devices?.count || 0;
        this.devicesSubject.next(lessons.devices?.rows);
      });
  }

  connect(collectionViewer: CollectionViewer): Observable<DeviceModel[]> {
    return this.devicesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.devicesSubject.complete();
    this.loadingSubject.complete();
  }
}
