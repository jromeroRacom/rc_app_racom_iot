import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationService } from '../../../global/services/navigation.service';
import { CbstService } from '../cbst.service';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { CBSTData } from '../cbst.model';
import { takeUntil } from 'rxjs/operators';
import { DeviceIoTModel, DeviceError } from '../../../global/models/device.model';

@Component({
  selector: 'app-cbst-dashboard',
  templateUrl: './cbst-dashboard.component.html',
  styleUrls: ['./cbst-dashboard.component.scss']
})
export class CbstDashboardComponent implements OnInit, OnDestroy {
  public timestamp = Date.now();                     // Timestamp de datos
  public deviceData !: CBSTData | undefined;         // Datos de dispositivo
  public deviceConfig !: DeviceIoTModel | undefined; // Datos de configuración de dispositivo
  private deviceError !: DeviceError | undefined;    // Datos de error de dispositivo
  public deviceErrors: string[] = [];                // Errores de dispositivo

  public flagErrorMode: boolean;                     // Bandera para error en modo
  public modeValueExpected: number | null;           // Modo esperado
  public modeExpected: boolean;                      // Bandera de espera de modo
  public modeAttempts: number;                       // Reintentos de modo

  private destroy$ = new Subject();           // Observable para acciones de destroy

   /** Constructor */
  constructor(
    private router: Router,                 // Menjo de rutas
    private navigation: NavigationService,  // Servicio de navegacion
    private cbstService: CbstService,       // Servicio de cbst
  ) {
    this.modeExpected = false; this.modeValueExpected = null; this.flagErrorMode = false; this.modeAttempts = 0;
  }
  /* --------------------------------------- */

  /** Ciclo de vide de Inicio */
  ngOnInit(): void {
    this.cbstService.onDeviceData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.logicCBSTData(data);
      });

    this.cbstService.onDeviceConfig()
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.deviceConfig = data;
    });
  }
  /* --------------------------------------- */

  /** Ciclo de vide de Final */
  ngOnDestroy(): void {
    this.destroy$.next();       // Dispara Observable
    this.destroy$.complete();   // Finaliza Observable
  }
  /* --------------------------------------- */

  /** Logica de datos de cbst */
  private logicCBSTData(data: CBSTData | undefined): void{
    if (data){
      this.deviceErrors = [];        // Reestablece errorres
      this.timestamp = Date.now();   // Pone hora actual

      this.logicErrorsCBST(data?.f || 0);

      switch (data?.c) {              // Estados de cisterna
        case 0: data.c = 5; break;    // Insuficiente
        case 1: data.c = 51; break;   // Llenando
        case 2: data.c = 49; break;   // Vaciando
        case 3: data.c = 100; break;  // LLeno
        default:
          break;
      }

      switch (data?.t) {              // Niveles de tinaco
        case 0: data.t = 1; break;    // Insuficiente
        case 1: data.t = 51; break;   // LLenando
        case 2: data.t = 49; break;   // Vaciando
        case 3: data.t = 100; break;   // LLenando
        default:
          break;
      }

      if ((data?.v || 0) <= 80){                           // Error en bajo voltaje
        this.deviceErrors.push('Bajo voltaje en CBST');
      }

      this.deviceData = data;         // Guarda datos en modelo


      if (this.modeExpected) {                           // Si se espera un cambio en modo
        if (this.modeValueExpected !== this.deviceData?.m) {       // Si el valor actual es diferente al esperado
          if ( (this.modeAttempts >= 3 ) ){                        // Más de 3 intentos
            this.modeAttempts = 0;                                 // Intentos en 0
            this.flagErrorMode = true;                             // Pone bandera de error
            this.modeExpected = false;                             // Quita bandera de esperando cambio
          }else{                                                   // No llegó comando de recepción
            this.modeAttempts++;                                   // Incrementa intentos de recepcion
          }
        }else{
          this.modeAttempts = 0;
          this.modeExpected = false;                               // Quita bandera de esperando cambio
        }
      }
    }
  }

  private logicErrorsCBST(flags: number): void{
    if ((flags && 0x01) === 1){
      this.cbstService.setDeviceError = {
        title: 'Error de comunicación',
        msg: `No se pueden adquirir datos del dispositivo CBST-0, puede deberse a un error interno o algun defecto de
        fabrica. Si el problema persiste comuníquese con su proveedor`,
        type: 'device',
        code: '0x37',
        error: []
      };
    }
  }

  public get getCisternClassLabel(): string {
    if (this.deviceData?.c){
      if (this.deviceData?.c === 100){ return 'label-success'; }
      if (this.deviceData?.c === 51){ return 'label-warning'; }
      if (this.deviceData?.c === 49){ return 'label-warning'; }
      if (this.deviceData?.c <= 15){ return 'label-danger'; }
    }
    return 'label-default';
  }

  public get getCisternClassProgress(): string {
    if (this.deviceData?.c){
      if (this.deviceData?.c === 100){ return 'progress-bar-success'; }
      if (this.deviceData?.c === 51){ return 'progress-bar-warning'; }
      if (this.deviceData?.c === 49){ return 'progress-bar-warning'; }
      if (this.deviceData?.c <= 15){ return 'progress-bar-danger'; }
    }
    return 'progress-bar';
  }

  public get getCisternText(): string {
    if (this.deviceData?.c !== undefined){
      if (this.deviceData?.c === 100){ return 'Llena'; }
      if (this.deviceData?.c === 51){ return 'Llenando'; }
      if (this.deviceData?.c === 49){ return 'Vaciando'; }
      if (this.deviceData?.c <= 15){ return 'Insuficiente'; }
    }
    return '??';
  }

  public get getTankText(): string {
    if (this.deviceData?.t !== undefined){
      if (this.deviceData?.t === 100){ return 'Lleno'; }
      if (this.deviceData?.t === 51){ return 'Llenando'; }
      if (this.deviceData?.t === 49){ return 'Vaciando'; }
      if (this.deviceData?.t <= 15){ return 'Insuficiente'; }
    }
    return '??';
  }

  public get getTankClassLabel(): string {
    if (this.deviceData?.t){
      if (this.deviceData?.t === 100){ return 'label-success'; }
      if (this.deviceData?.t === 51){ return 'label-info'; }
      if (this.deviceData?.t === 49){ return 'label-info'; }
      if (this.deviceData?.t <= 15){ return 'label-danger'; }
    }
    return 'label-default';
  }

  public get getTankClassProgress(): string {
    if (this.deviceData?.t){
      if (this.deviceData?.t === 100){ return 'progress-bar-success'; }
      if (this.deviceData?.t === 51){ return 'progress-bar-info'; }
      if (this.deviceData?.t === 49){ return 'progress-bar-info'; }
      if (this.deviceData?.t <= 15){ return 'progress-bar-danger'; }
    }
    return 'progress-bar';
  }

  public get getPumpClass(): string {
    if (this.deviceData?.p === 0){return 'col-red'; }
    if (this.deviceData?.p === 1){return 'col-green'; }
    return 'col-grey';
  }

  public get getPumpText(): string {
    if (this.deviceData?.p === 0){return 'Apagada'; }
    if (this.deviceData?.p === 1){return 'Encendida'; }
    return '??';
  }

  public get getModeText(): string {
    if (this.deviceData?.m === 0) { return 'Fuera'; }
    if (this.deviceData?.m === 2) { return 'Automático'; }
    if (this.deviceData?.m === 1) { return 'Manual'; }
    return '??';
  }

  public get getColorVoltage(): string{
    if ((this.deviceData?.v || 0) <= 80) { return 'red'; }
    if ((this.deviceData?.v || 0) > 80) { return 'yellow'; }

    return 'yellow';
  }

  public get getWiFiSignalText(): string {
    if (this.deviceData?.rssi){
      if (this.deviceData?.rssi >= -60 ){ return 'Buena'; }
      else if (this.deviceData?.rssi >= -67){ return 'Regular'; }
      else if (this.deviceData?.rssi >= -75){ return 'Mala'; }
      else {return 'Muy Mala'; }
    }
    return '??';
  }

  public get getWiFiSignalClass(): string {
    if (this.deviceData?.rssi){
      if (this.deviceData?.rssi >= -60 ){ return 'col-green'; }
      else if (this.deviceData?.rssi >= -67){ return 'col-yellow'; }
      else if (this.deviceData?.rssi >= -75){ return 'col-red'; }
      else {return 'col-grey'; }
    }
    return 'col-grey';
  }



  public changeModeState(value: number): void {
    if (value !== this.deviceData?.m) {
      this.modeValueExpected = value;
      this.modeExpected = true;

      const topic = `/${this.deviceConfig?.mqtt.topic}/in/md`;
      this.cbstService.mqttOnPublish(topic, `{"val": ${value} }`)
        .pipe(takeUntil(this.destroy$)).subscribe();
    }
  }


}
