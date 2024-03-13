import { DeviceModel } from './../../../../global/models/device.model';
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { DevicesTableService } from './devices-table.service';
import { DeviceTableDataSource } from './device-table.datasource';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'app-devices-table',
  templateUrl: './devices-table.component.html',
  styleUrls: ['./devices-table.component.scss']
})
export class DevicesTableComponent implements OnInit, AfterViewInit {
  dataSource!: DeviceTableDataSource;
  displayedColumns = ['select', 'alias', 'serial', 'macid', 'type', 'actions'];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; // Obtiene referencia de paginador
  @ViewChild(MatSort, { static: true }) sort!: MatSort; // Obtiene referencia de ordenador
  @ViewChild('filter', { static: true }) filter!: ElementRef; // Obtiene referencia del buscador
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger; // Obtiene referencia del menú de contexto
  selection = new SelectionModel<DeviceModel>(true, []); // Arreglo para multiple selección

  contextMenuPosition = { x: '0px', y: '0px' }; // Establece posicion de menú de contexto

  constructor(
    private route: ActivatedRoute,
    private devicesService: DevicesTableService
  ) {}

  ngOnInit(): void {
    this.dataSource = new DeviceTableDataSource(this.devicesService);
    this.dataSource.getDevicesFromService('', 'asc', 0, 10);
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadDevicesPage();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadDevicesPage()))
      .subscribe();
  }

  loadDevicesPage(): void {
    this.dataSource.getDevicesFromService(
      this.filter.nativeElement.value,
      this.sort.direction,
      this.paginator.pageIndex * this.paginator.pageSize,
      this.paginator.pageSize
    );
  }

  addNew(): void {}

  removeSelectedRows(): void {}

  refresh(): void {
    // Recarga datos de tabla
    // this.loadData();
  }

  editCall(row: DeviceModel): void {}

  deleteItem(row: DeviceModel): void {}

  reviewDevice(row: DeviceModel): void {}

  isAllSelected(): boolean {
    // Determina si estan todos seleccionados
    // const numSelected = this.selection.selected.length;          // Obtiene los seleccionados
    // const numRows = this.dataSource.renderedData.length;         // Obtiene el total
    // return numSelected === numRows;
    return true;
  }

  masterToggle(): void {
    // Togglea los checkboxes
    // this.isAllSelected()  ? this.selection.clear()
    //                       : this.dataSource.renderedData.forEach((row) => this.selection.select(row)
    //     );
  }
}
