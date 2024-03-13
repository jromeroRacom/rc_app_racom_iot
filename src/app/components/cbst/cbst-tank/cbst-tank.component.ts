import { Component, OnInit, OnDestroy } from '@angular/core';
import { CBSTData } from '../cbst.model';
import { Subject } from 'rxjs';
import { CbstService } from '../cbst.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-cbst-tank',
  templateUrl: './cbst-tank.component.html',
  styleUrls: ['./cbst-tank.component.scss']
})
export class CbstTankComponent implements OnInit, OnDestroy {

  public deviceData !: CBSTData | undefined;         // Datos de dispositivo
  private destroy$ = new Subject();                 // Observable para acciones de destroy
  public fullValue = 100;                           // Maximo de tinaco

  /** Constructor */
  constructor(
    private cbstService: CbstService,       // Servicio de cbst
  ) { }
  /* --------------------------------------- */


  /** Ciclo de vide de Inicio */
  ngOnInit(): void {
    this.cbstService.onDeviceData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.logicCBSTTank(data);
      });
  }
  /* --------------------------------------- */


   /** Ciclo de vide de Final */
  ngOnDestroy(): void{
    this.destroy$.next();       // Dispara Observable
    this.destroy$.complete();   // Finaliza Observable
  }
  /* --------------------------------------- */

  /** Logica de datos de tinaco */
  private logicCBSTTank(data: CBSTData | undefined): void{
    if (data){
      switch (data?.t) {              // Niveles de tinaco
        case 0: data.t = 0; break;    // Insuficiente
        case 1: data.t = 55; break;   // LLenando
        case 2: data.t = 45; break;   // Vaciando
        case 3: data.t = 100; break;   // LLeno
        default:
          break;
      }
      this.deviceData = data;         // Guarda datos en modelo

      this.logicErrorsCBST(data?.f || 0);   // Logica de errores de datos
    }
  }
  /* --------------------------------------- */

  /** Logica de errores de cbst */
  private logicErrorsCBST(flags: number): void{
    if ((flags && 0x01) === 1){
      this.cbstService.setDeviceError = {
        title: 'Error de comunicación',
        msg: `No se pueden adquirir datos del dispositivo CBST-0, puede deberse a un error interno o algun defecto de
        fabrica. Si el problema persiste comuniquese con su proveedor`,
        type: 'device',
        code: '0x37',
        error: []
      };
    }
  }
  /* --------------------------------------- */

  /** Logica al presionar los labeles de tinaco */
  tankLabelLogic(alias: string): void{
    console.log('Se presiono el: ', alias);
  }
  /* --------------------------------------- */



}
