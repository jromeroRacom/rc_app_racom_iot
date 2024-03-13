import { Injectable } from '@angular/core';
import { QoS } from 'mqtt-packet';
import { MqttService, IMqttServiceOptions, IMqttMessage, IOnErrorEvent, IMqttClient } from 'ngx-mqtt';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { timeout, take, mapTo, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DeviceIoTModel, DeviceError } from '../../global/models/device.model';
import { CBSTData } from './cbst.model';


@Injectable({
  providedIn: 'root'
})
export class CbstService {
  private mqttHost: string = environment.mqtt.host; // Host Broker
  private mqttPort: number = environment.mqtt.port; // Puerto Broker
  private mqttPath: string = environment.mqtt.path; // Protocolo de broker
  private mqttProtocol: 'ws' | 'wss' = environment.mqtt.protocol === 'wss' ? 'wss' : 'ws'; // Path de broker

  private deviceConfig$!: BehaviorSubject<DeviceIoTModel | undefined>;  // Configuración de dispositivo
  private deviceData$!: BehaviorSubject<CBSTData | undefined>;          // Datos de dispositivo
  private deviceError$!: BehaviorSubject<DeviceError | undefined>;      // Errores a main-device

  private flagConnected = false;

  /** Constructor */
  constructor(
    private mqttService: MqttService
  ) { }
  /* --------------------------------------- */

  start(): void{
    this.deviceConfig$ = new BehaviorSubject<DeviceIoTModel | undefined>(undefined);
    this.deviceData$ = new BehaviorSubject<CBSTData | undefined>(undefined);
    this.deviceError$ = new BehaviorSubject<DeviceError | undefined>(undefined);
  }

  /** Obtiene datos de configuracion de dispositivo */
  get getDeviceConfig(): DeviceIoTModel | undefined { return this.deviceConfig$.value; }
  /* --------------------------------------- */

  /** Establece datos de configuracion de dispositivo */
  set setDeviceConfig(device: DeviceIoTModel | undefined){ this.deviceConfig$.next(device); }
  /* --------------------------------------- */

  /** Subscripción a cambio de datos de configuracion de dispositivo  */
  onDeviceConfig(): Observable<DeviceIoTModel| undefined> { return this.deviceConfig$; }
  /* --------------------------------------- */

  /** Elimina Subscripción a cambio de datos de configuracion de dispositivo */
  destroyDeviceConfig(): void { this.deviceConfig$.complete(); }
  /* --------------------------------------- */

  /** Obtiene datos de dispositivo */
  get getDeviceData(): CBSTData | undefined { return this.deviceData$.value; }
  /* --------------------------------------- */

  /** Establece datos  de dispositivo */
  set setDeviceData(device: CBSTData){ this.deviceData$.next(device); }
  /* --------------------------------------- */

  /** Actualización  datos  de dispositivo */
  set updateDeviceData(device: CBSTData){
    const prev = this.getDeviceData;
    const data: CBSTData = {
      c: (device?.c !== undefined) ? device?.c : prev?.c ,
      t: (device?.t !== undefined) ? device?.t : prev?.t ,
      m: (device?.m !== undefined) ? device?.m : prev?.m ,
      p: (device?.p !== undefined) ? device?.p : prev?.p ,
      v: (device?.v !== undefined) ? device?.v : prev?.v ,
      f: (device?.f !== undefined) ? device?.f : prev?.f ,
      s: (device?.s !== undefined) ? device?.s : prev?.s ,
      h: (device?.h !== undefined) ? device?.h : prev?.h ,
      ssid: (device?.ssid !== undefined) ? device?.ssid : prev?.ssid,
      rssi: (device?.rssi !== undefined) ? device?.rssi : prev?.rssi,
    };
    this.deviceData$.next(data);
  }
  /* --------------------------------------- */

  /** Subscripción a cambio de datos de dispositivo  */
  onDeviceData(): Observable<CBSTData| undefined> { return this.deviceData$; }
  /* --------------------------------------- */

  /** Elimina Subscripción a cambio de datos de dispositivo */
  destroyDeviceData(): void { this.deviceData$.complete(); }
  /* --------------------------------------- */

  /** Obtiene errores de dispositivo */
  get getDeviceError(): DeviceError | undefined { return this.deviceError$.value; }
  /* --------------------------------------- */

  /** Establece errores de dispositivo */
  set setDeviceError(device: DeviceError){ this.deviceError$.next(device); }
  /* --------------------------------------- */

  /** Subscripción a cambio de errores  de dispositivo  */
  onDeviceError(): Observable<DeviceError| undefined> { return this.deviceError$; }
  /* --------------------------------------- */

  /** Elimina Subscripción a cambio de errores de dispositivo */
  destroyDeviceError(): void { this.deviceError$.complete(); }
  /* --------------------------------------- */

  /** Conexión a broker de mqtt */
  mqttConnect(options: IMqttServiceOptions): void{
    options.connectOnCreate = false,
    options.protocol = this.mqttProtocol,
    options.hostname = this.mqttHost,
    options.port = this.mqttPort,
    options.path = this.mqttPath,
    options.keepalive = 60;
    this.mqttService.connect(options);
  }
  /* --------------------------------------- */

  /** Desconexión de broker de mqtt */
  mqttDisconect(): void {
    if ( this.mqttService.state instanceof BehaviorSubject && this.mqttService.state.value >= 1) {
      console.log('Desconecta mqtt');
      this.mqttService.disconnect(true);
    }
  }
  /* --------------------------------------- */

  /** Observable a publicación de mensaje a broker mqtt */
  mqttOnPublish(topic: string, message: string, qos: QoS = 0, retain: boolean = false ): Observable<any>{
    return this.mqttService.publish(topic, message, { qos , retain });
  }
  /* --------------------------------------- */

  /** Observable de subscripción a topico de broker */
  mqttOnSubscribe(topic: string , qos: QoS = 0 ): Observable<any>{
    return this.mqttService.observe(topic , {qos})
       .pipe(
          map(val =>  val = JSON.parse(val.payload.toString()) ));
  }
  /* --------------------------------------- */

  /** Observable de conexión a broker */
  mqttOnConnect(): Observable<any>{
    return this.mqttService.onConnect.pipe(tap(val => {this.flagConnected = true; }));
  }
  /* --------------------------------------- */

  /** Observable de conexión a broker */
  mqttOnReconnect(): Observable<any>{
    return this.mqttService.onReconnect.pipe(tap(val => {this.flagConnected = true; }));
  }
  /* --------------------------------------- */

  /** Observable de error en broker */
  mqttOnError(): Observable<IOnErrorEvent>{
    return this.mqttService.onError;
  }
  /* --------------------------------------- */
}
