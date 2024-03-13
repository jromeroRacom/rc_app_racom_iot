import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { DeviceTableRowModel } from './devices-table.model';
import { Observable, BehaviorSubject, Subject, merge } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { DevicesTableService } from './devices-table.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { takeUntil, finalize, map } from 'rxjs/operators';


export class DevicesTableDataSource implements DataSource<DeviceTableRowModel> {

  private errorEvent$ = new Subject<HttpErrorResponse>();      // Manejador de errores
  dataChange = new BehaviorSubject<DeviceTableRowModel[]>([]);  // Cambios en datos
  filterChange = new BehaviorSubject('');                      // Cambios en filtro
  filteredData: DeviceTableRowModel[] = [];                     // Datos filtrados
  renderedData: DeviceTableRowModel[] = [];                     // Datos mostrados
  public flagLoading = true;                                   // Bamdera para detectar loading
  private destroy$ = new Subject();                            // Observable para acciones de destroy

  /** Constructor */
  constructor(
    public tableService: DevicesTableService,      // Servicio de tabla
    public paginator: MatPaginator,                // Manejo de paginador
    public sort: MatSort,                          // Manejo de ordenador
    private userId: number                         // Determina tipo de datos a traer
  ) {
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0)); // Si hay un cambio en el filtro se reestablece paginador
  }
  /* --------------------------------------- */

  /** Obtiene errorres de datasource */
  get errors(): Observable<any>{ return this.errorEvent$; }

  /** Obtiene datos de dispositivos  */
  get data(): DeviceTableRowModel[] { return this.dataChange.value; }
  /* --------------------------------------- */

  /** Obtiene valor de filtro */
  get filter(): string { return this.filterChange.value; }
  /* --------------------------------------- */

  /** Establece valor de filtro */
  set filter(filter: string) { this.filterChange.next(filter); }
  /* --------------------------------------- */

  /** Obtiene datos de tabla */
  getDataFromService(): void {
    this.dataChange.next([]);                     // Borra tabla
    this.flagLoading = true;                      // Pone loading

    this.tableService.getDevices(this.userId)                 // Petición para obtener datos de tabla
    .pipe(
      takeUntil(this.destroy$),                        // Lógica de destroy
      finalize(() => this.flagLoading = false)         // Quita bandera de loading
    )
    .subscribe((data) => {                          // Subscripción
      this.dataChange.next(data.devices?.rows);   // Pone nuevos datos
    }, (error: HttpErrorResponse) => {
      this.dataChange.next([]);                        // Pone tabla vacia
      this.errorEvent$.next(error);                    // Pone error
    });

  }

  connect( collectionViewer: CollectionViewer): Observable<DeviceTableRowModel[]> {
    const displayDataChanges = [         // Eventos de cambio
      this.dataChange,                   // Evento de actualizacion de datos
      this.sort.sortChange,              // Evento de cambio en el ordenador
      this.filterChange,                 // Evento de cambio en el filtro
      this.paginator.page                // Evento de cambio en el paginador
    ];

    this.getDataFromService();              // Obtiene datos iniciales

    return merge(...displayDataChanges).pipe(  // Retorna conjunto de eventos
      map(() => {
        // Logica de filtro
        this.filteredData = this.data                   // Obtiene datos
          .slice()                                      // Obtiene una copia cortada
          .filter((deviceRow: DeviceTableRowModel) => { // Filtra cada columna con filtro
            const searchStr = (                         // String de busqueda
              deviceRow.serial +
              deviceRow.alias +
              deviceRow.macid +
              deviceRow.fwVersion +
              deviceRow.hwVersion +
              deviceRow.type +
              deviceRow.createdAt +
              deviceRow.updatedAt
            ).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;  // Busca con termino de busqueda
          });
        const sortedData = this.sortData(this.filteredData.slice());                 // Ordena los datos filtrados
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;       // Ontiene indece de paginador
        this.renderedData = sortedData.splice( startIndex, this.paginator.pageSize); // Obtiene datos para mostrar
        return this.renderedData;                                                    // Retorna datos a mostrar
      })
    );

  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.destroy$.next();           // Dispara Observable
    this.destroy$.complete();       // Finaliza Observable
    this.filterChange.complete();   // Finaliza observable de filtro
    this.dataChange.complete();     // Finaliza observable de datos
    this.errorEvent$.complete();    // Finaliza observable de errores
  }

  /** Returns a sorted copy of the database data. */
  sortData(data: DeviceTableRowModel[]): DeviceTableRowModel[] {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '' ;
      let propertyB: number | string = '' ;
      switch (this.sort.active) {
        case 'serial':
          [propertyA, propertyB] = [a.serial, b.serial];
          break;
        case 'alias':
          [propertyA, propertyB] = [a.alias, b.alias];
          break;
        case 'macid':
          [propertyA, propertyB] = [a.macid, b.macid];
          break;
        case 'fwVersion':
          [propertyA, propertyB] = [a.fwVersion, b.fwVersion];
          break;
        case 'hwVersion':
          [propertyA, propertyB] = [a.hwVersion, b.hwVersion];
          break;
        case 'type':
          [propertyA, propertyB] = [a.type, b.type];
          break;
        case 'createdAt':
          [propertyA, propertyB] = [a.createdAt.valueOf(), b.createdAt.valueOf()];
          break;
        case 'updatedAt':
          [propertyA, propertyB] = [a.updatedAt.valueOf(), b.updatedAt.valueOf()];
          break;
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (
        (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1)
      );
    });
  }


}
