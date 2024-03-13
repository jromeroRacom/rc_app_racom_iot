import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Output,  Input, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DeviceModel, DeviceIoTModel, DeviceError } from '../../../global/models/device.model';
import { ResponseModel, ErrorModel } from '../../../global/models/back-end.models';

import { MainService } from '../../main/main.service';
import { LoadingDialogService } from '../../../global/services/loading-dialog.service';
import { SnackBarService } from '../../../global/services/snack-bar.service';
import { MQTTCredentialsModel } from '../../../global/models/mqtt-credentials.model';



@Component({
  selector: 'app-main-device',
  templateUrl: './main-device.component.html',
  styleUrls: ['./main-device.component.scss']
})
export class MainDeviceComponent implements OnInit, OnDestroy{

  public error!: boolean;                           // Flag si hubo error
  public errorMsg!: string;                         // Mensaje de error
  public errorTitle!: string;                       // Titulo de error
  public errorIcon!: string;                        // Icono de error
  public errorRef!: string;                         // Codigo de error
  public listErrors: ErrorModel[] = [];             // Lista de errores
  private destroy$ = new Subject();                 // Observable para acciones de destroy
  private device!: DeviceModel;                     // Modelo de dispositivo
  private deviceStatus = false;                     // Flag de estatus de dispositivo
  private deviceCredentials!: MQTTCredentialsModel; // Modelo de dispositivo iot

  @Input() externalError$!: Subject<DeviceError>;
  @Input() type = 'none';                                    // Tipo de dispositivo
  @Input() serial = 'none';                                  // Serial de dispositivo
  @Output() deviceIOT = new EventEmitter<DeviceIoTModel>();  // Evento de dispositivo iot
  @Output() deviceError = new EventEmitter<boolean>();       // Evento de error de dispsoitivo

  constructor(
    public snack: SnackBarService,         // Servicio de snack bar personalizado
    private loading: LoadingDialogService, // Servicio de dialog loaging personalizado
    private mainService: MainService       // Servicio de auth
  ) {
  }

  /** Ciclo de vide de Inicio */
  ngOnInit(): void {
    this.deviceInitLogic(this.type, this.serial);          // Logica de inicialización de dispositivo iot
    this.getExternalErrors();
  }
  /* --------------------------------------- */

  /** Ciclo de vide de Final */
  ngOnDestroy(): void {
    this.destroy$.next();     // Dispara Observable
    this.destroy$.complete(); // Finaliza Observable
  }
  /* --------------------------------------- */

  /** Suscripción a errores externos */
  private getExternalErrors(): void{
    if (this.externalError$){
      this.externalError$.pipe(takeUntil(this.destroy$))
      .subscribe((error) => { this.showDeviceError(error); });
    }
  }
  /* --------------------------------------- */

  /** Lógica de inicialización de dispositivo iot */
  private async deviceInitLogic(type: string, serial: string): Promise<void> {
    try {
      this.loading.show();
      this. device = await this.logicGetDeviceData(type, serial);            // Obtiene info de dispositivo
      this.deviceStatus = await this.logicGetDeviceStatus(serial);           // Obtiene estatus de dispositivo
      this.deviceCredentials = await this.logicGetDeviceCredentials(serial); // Obtiene credenciales de dispositivo
      this.loading.close();
      const deviceIoT: DeviceIoTModel = {     // Modelo de device iot
        device: this. device,
        status: this.deviceStatus,
        mqtt: this.deviceCredentials,
      };
      this.deviceIOT.emit(deviceIoT);     // Emite evento de device iot obtenido
    } catch (error) {
      this.loading.close();                                     // Cierra el Loading
      const dataError: DeviceError = error;   // Obtiene error
      this.showDeviceError( dataError );      // Muestra error en front end
    }
  }
  /* --------------------------------------- */

  /** Lógica para adquirir datos de dispositivo */
  private logicGetDeviceData(type: string, serial: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.mainService.userGetDeviceData(type.toLowerCase(), serial)                // Petición obtener dispositivo
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: ResponseModel) => {                             // Recepción correcta
          resolve(data.device);
        },
        (error: HttpErrorResponse) => {
          const dataError: DeviceError = {
            title: 'Ocurrió algún error' ,
            msg: `No se pudo obtener información de dispositivo seleccionado (${serial}). Puede
            deberse a que no existe o que se encuentra registrado en otra cuenta`,
            type: 'basic',
            code: '0x30',
            error: error.error?.errors || [{msg: 'Error inesperado'}]
          };
          reject(dataError);
        }
      );
    });
  }
  /* --------------------------------------- */

  /** Lógica para adquirir estatus de dispositivo */
  private logicGetDeviceStatus(serial: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.mainService.userGetDeviceStatus(serial)            // Petición obtener estatus de dispositivo
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: ResponseModel) => {                             // Recepción correcta
          if (!data.state){                             // Determina error de no conectado
            const dataError: DeviceError = {
              title: `${this.device.type.toUpperCase()} sin conexión` ,
              msg: `No se pudo establecer conexión con el dispositivo seleccionado (${serial}). Puede
              deberse a que el dispositivo ${this.device.type.toUpperCase()} no tiene conexión a internet o
              no se encuentra en funcionamiento`,
              type: 'no-connection',
              code: '0x31',
              error: []
            };
            this.showDeviceError( dataError );
          }
          resolve(data.state);
        },
        (error: HttpErrorResponse) => {
          const dataError: DeviceError = {
            title: `Ocurrio algún error` ,
            msg: `No se pudo obtener el estatus del dispositivo seleccionado (${serial}). Puede deberse
            a que no existe, que se encuentre registrado en otra cuenta o a un error interno del servidor.
            Si el error persiste contáctanos.`,
            type: 'basic',
            code: '0x32',
            error: error.error?.errors || [{msg: 'Error inesperado'}]
          };
          reject(dataError);
        }
      );
    });
  }
  /* --------------------------------------- */

  /** Lógica para adquirir datos de dispositivo */
  private logicGetDeviceCredentials(serial: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.mainService.userGetDeviceCredentials( serial)                // Petición obtener dispositivo
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: ResponseModel) => {                             // Recepción correcta
          const newData: MQTTCredentialsModel = {
            user: `web-${data.data?.u}`,
            password: `${data.data?.a}`,
            topic: `${data.data?.y}/${data.data?.t}`
          };
          resolve(newData);
        },
        (error: HttpErrorResponse) => {
          const dataError: DeviceError = {
            title: 'Ocurrió algún error' ,
            msg: `No se pudo obtener las credenciales de acceso del dispositivo seleccionado (${serial}). Puede
            deberse a que no existen o no se tienen los permisos para este dispositivo`,
            type: 'no-credentials',
            code: '0x33',
            error: error.error?.errors || [{msg: 'Error inesperado'}]
          };
          reject(dataError);
        }
      );
    });
  }
  /* --------------------------------------- */

  /** Muestra error en front */
  private showDeviceError(dataError: DeviceError ): void {
    this.deviceError.emit(true);                                          // Emite error
    this.snack.show('danger', '¡¡¡Ocurrió un error!!!', 'top', 'rigth');  // Muestra snack de error

    const data: DeviceError = {                               // Obtiene datos o pone default
      title: dataError.title || 'Ocurrio algún error',
      msg: dataError.msg || ' Error inesperado',
      type: dataError.type || 'unknown',
      code: dataError.code || '0xFF',
      error: dataError.error || [{msg: 'Error inesperado'}]
    };

    switch (data.type) {                                            // Determina tipo de error para poner icono diferente
      case 'basic': this.errorIcon = 'fas fa-sad-tear'; break;
      case 'no-connection': this.errorIcon = 'fas fa-wifi'; break;
      case 'no-credentials': this.errorIcon = 'fas fa-key'; break;
      case 'internal': this.errorIcon = 'fas fa-server'; break;
      case 'unknown': this.errorIcon = 'fas fa-bug'; break;
      case 'device': this.errorIcon = 'fas fa-microchip'; break;
      default: this.errorIcon = 'fas fa-sad-tear'; break;
    }

    this.error = true;                 // Pone flag de error
    this.errorTitle = data.title;      // Pone titulo de error
    this.errorMsg = data.msg;          // Pone mensaje de error
    this.errorRef = data.code;         // Pone codigo de error
    this.listErrors = data.error;      // Pone lista de errores
  }
  /* --------------------------------------- */

}
