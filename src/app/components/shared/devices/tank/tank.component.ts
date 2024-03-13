import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';

export interface TankLabels{
  color: string;
  value: number;
  alias: string;
}

@Component({
  selector: 'app-tank',
  templateUrl: './tank.component.html',
  styleUrls: ['./tank.component.scss']
})
export class TankComponent implements OnInit, OnDestroy {

  @Input() value = 100;                     // Valor de 0-100%
  @Input() fullValue = 100;                 // Total al 100%
  @Input() units  = '%';                    // Unidades a mostrar
  @Input() labelsT: TankLabels[] = [] ;      // Unidades a mostrar
  @Output() tankEmitter = new EventEmitter<string>();  // Emisor de eventos de clicks en labels

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void{
    this.tankEmitter.complete();       // Termina observable
  }

  get getUnitsValue(): number{                     // Retorna valor en unidades
    return (this.value * this.fullValue) / (100);  // Regla de 3 para 100% y valor máximo
  }

  public onLabelClick(alias: string): void{
    this.tankEmitter.emit(alias);     // Evento de click en algun label
  }

}
