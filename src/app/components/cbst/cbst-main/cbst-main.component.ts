import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, timer, Subscription, interval } from 'rxjs';
import { takeUntil, switchMap, timeout, take } from 'rxjs/operators';
import { IMqttServiceOptions, IOnConnectEvent } from 'ngx-mqtt';

import {
  DeviceIoTModel,
  DeviceError
} from '../../../global/models/device.model';

import { NavigationService } from '../../../global/services/navigation.service';
import { CbstService } from '../cbst.service';
import { CBSTData } from '../cbst.model';

@Component({
  selector: 'app-cbst-main',
  templateUrl: './cbst-main.component.html',
  styleUrls: ['./cbst-main.component.scss']
})
export class CbstMainComponent implements OnInit, OnDestroy {
  public error$ = new Subject<DeviceError>();     // Subject para envio de errores a main-device

  public serial: string;                   // Serial de dispositivo
  public type: string;                     // Tipo de dispositivo
  public navLinks: any[];                  // Arreglo de enlaces
  public activeLinkIndex = -1;             // Determina enlace activo
  public flagDeviceData = false;           // Flag para saber si se cargó datos de dispositivo
  public flagLoading = true;               // Flag para determinar loading
  private destroy$ = new Subject();        // Observable para acciones de destroy
  private timeoutData$ = new Subject();    // Observable para timeout de datos
  private deviceIOT!: DeviceIoTModel;      // Modelo de dispositivo
  private timerKeepAlive$!: Subscription;   // Subscripción para timer de datos completos
  public mqttConnected = false;            // Bandera para determinar conexion de mqtt

  /** Constructor */
  constructor(
    private route: ActivatedRoute, // Manejo de ruta activa
    private router: Router, // Menjo de rutas
    private navigation: NavigationService, // Servicio de navegacion
    private cbstService: CbstService,
  ) {
    this.serial = this.route.snapshot.paramMap.get('serial') || 'unknown'; // Obtiene serial de url
    this.type = this.route.snapshot.url[1].path || 'unknown';              // Obtiene tipo de url
    this.navLinks = [                                                      // Inicializa los enlaces de dispositivo
      { label: 'Tablero', link: './dashboard', maticon: 'dashboard' },
      // { label: 'Tinaco', link: './tank', maticon: 'straighten' },
      { label: 'Ajustes', link: './settings', maticon: 'settings' }
    ];

    this.cbstService.start();
  }
  /* --------------------------------------- */

  /** Ciclo de vide de Inicio */
  ngOnInit(): void {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((res) => {  // Se suscribe a eventos de router
      this.activeLinkIndex = this.navLinks.indexOf(                         // Busca si esta en url
        this.navLinks.find((tab) => tab.link === '.' + this.router.url)
      );
    });

    this.cbstService.onDeviceError()                          // Subscripción a errores de dispositivo
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        this.error$.next(error);
        this.destroyMqtt();
        if (this.timerKeepAlive$) { this.timerKeepAlive$.unsubscribe(); }  // Finaliza observable de timer datos completos
      });
  }
  /* --------------------------------------- */

  /** Ciclo de vide de Final */
  ngOnDestroy(): void {
    this.destroy$.next();                    // Dispara Observable de destroy
    this.destroy$.complete();                // Finaliza Observable de destroy
    this.cbstService.destroyDeviceError();   // Finaliza observable de errores
    this.cbstService.destroyDeviceConfig();  // Finaliza observable de configuracion
    this.cbstService.destroyDeviceData();    // Finaliza observable de datos
    this.cbstService.mqttDisconect();        // Finaliza conexión a mqtt
    if (this.timeoutData$) { this.timeoutData$.unsubscribe(); }  // Finaliza observable de timer datos completos
    if (this.timerKeepAlive$) { this.timerKeepAlive$.unsubscribe(); }  // Finaliza observable de timer datos completos
  }
  /* --------------------------------------- */

  /** Obtiene alias de dispsoitivo */
  public get getDeviceAlias(): string {
    return this.deviceIOT?.device?.alias || '';
  }
  /* --------------------------------------- */

  /** Establece datos de dispositivo */
  setDeviceConfig(data: DeviceIoTModel): void {
    this.deviceIOT = data;
    this.cbstService.setDeviceConfig = data;
    if (data.status) {
      this.flagDeviceData = true;
      this.logicMQTTConnection();
    }
  }
  /* --------------------------------------- */

  /** Establece si hubo un error en el sistema */
  setDeviceError(event: boolean): void {
    this.flagDeviceData = false;
  }
  /* --------------------------------------- */

  /** Lógica de conexión MQTT usando websockets */
  private logicMQTTConnection(): void {
    const MQTT_OPTIONS: IMqttServiceOptions = {   // Opciones de mqtt
      username: this.deviceIOT.mqtt.user,
      password: this.deviceIOT.mqtt.password,
      will: {
        topic: `/${this.deviceIOT.mqtt.topic}/in/cmd`,
        payload: '{"val" : 33}',
        qos: 0,
        retain: false
      }
    };

    this.cbstService.mqttConnect(MQTT_OPTIONS);   // Conecta mqtt

    this.cbstService.mqttOnConnect()              // Subscripción de mqtt
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: IOnConnectEvent) => {
        this.mqttConnected = true;
        this.flagLoading = false;
        this.cbstMainSubscribe();              // Se subscribe al topico de datos
        this.askForInitData();                 // Solicita datos iniciales
        if (!this.timerKeepAlive$) {                 // Si no existe timer de keep alive
          this.timerKeepAlive$ = timer(5000, 25000) // Inicializa timer de keep alive
            .pipe(takeUntil(this.destroy$))
            .subscribe(val => this.mqttKeppAlive());
        }
      }
      );

    this.cbstService.mqttOnReconnect()
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        console.log('Reconecta');
      });

    this.cbstService.mqttOnError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        console.log(error);
        if (error.name === 'Timeout') {
          console.log('Ya se descompuso');
        }
        // this.errorConectionMQTT();
      }
      );

    this.timeoutData$                              // Observable si no se reciben datos en 1 min
      .pipe(
        switchMap((ev) => interval(60000)),         // Timer de 1 min cada que se reciben datos
        take(1),                                    // Toma solo uno
        takeUntil(this.destroy$)                    // Elimina al destruirse
      )
      .subscribe((ev) => {
        console.log('timeout');
        this.error$.next({
          title: `${this.deviceIOT?.device?.type.toUpperCase()} sin conexión`,
          msg: `No se pudo establecer conexión con el dispositivo seleccionado (${this.deviceIOT?.device?.serial}). Puede
          deberse a que el dispositivo ${this.deviceIOT?.device?.type.toUpperCase()} no tiene conexión a internet o
          no se encuentra en funcionamiento`,
          type: 'no-connection',
          code: '0x35',
          error: []
        });
        this.cbstService.mqttDisconect();  // Desconecta de mqtt
        if (this.timeoutData$) { this.timeoutData$.unsubscribe(); }  // Finaliza observable de timer datos completos
        if (this.timerKeepAlive$) { this.timerKeepAlive$.unsubscribe(); }  // Finaliza observable de timer datos completos
      });
  }
  /* --------------------------------------- */

  /** Solicita datos iniciales de mqtt */
  private askForInitData(): void {
    const topic = `/${this.deviceIOT.mqtt.topic}/in/cmd`;
    this.cbstService.mqttOnPublish(topic, '{"val": 0}').pipe(takeUntil(this.destroy$)).subscribe();
  }
  /* --------------------------------------- */

  /** Comando de keep alive para microcontroler */
  private mqttKeppAlive(): void {
    const topic = `/${this.deviceIOT.mqtt.topic}/in/cmd`;
    this.cbstService.mqttOnPublish(topic, '{"val": 55}').pipe(takeUntil(this.destroy$)).subscribe();
  }
  /* --------------------------------------- */

  /** Lógica de subscripción a tópico principal */
  private cbstMainSubscribe(): void {
    this.cbstService.mqttOnSubscribe('/' + this.deviceIOT.mqtt.topic + '/out', 1)
      .pipe(takeUntil(this.destroy$))
      .subscribe((msg: CBSTData) => {
        this.timeoutData$.next();
        if (msg?.lwt === -1) { this.deviceLWT(); }    // LWT de micro
        this.cbstService.updateDeviceData = msg;
      });
  }
  /* --------------------------------------- */

  /** desconexión de dispositivo mqtt */
  private deviceLWT(): void {
    this.error$.next({
      title: `${this.deviceIOT?.device?.type.toUpperCase()} sin conexión`,
      msg: `No se pudo establecer conexión con el dispositivo seleccionado (${this.deviceIOT?.device?.serial}). Puede
      deberse a que el dispositivo ${this.deviceIOT?.device?.type.toUpperCase()} no tiene conexión a internet o
      no se encuentra en funcionamiento`,
      type: 'no-connection',
      code: '0x36',
      error: []
    });
    this.cbstService.mqttDisconect();  // Desconecta de mqtt
    if (this.timeoutData$) { this.timeoutData$.unsubscribe(); }        // Finaliza observable de timer datos completos
    if (this.timerKeepAlive$) { this.timerKeepAlive$.unsubscribe(); }  // Finaliza observable de timer datos completos
  }
  /* --------------------------------------- */


  /** Error de conexión a mqtt */
  private errorConectionMQTT(): void {
    this.destroyMqtt();
    this.mqttConnected = false;
    this.error$.next({
      title: 'Error de conexión',
      msg: `No se pudo conectar con administrador de dispositivos, puede deberse a un error en
      la conexión a internet o a un error interno. Si el problema persiste comuníquese con su proveedor`,
      type: 'internal',
      code: '0x34',
      error: []
    });
  }
  /* --------------------------------------- */

  /** Destruye subscripciones de mqtt */
  private destroyMqtt(): void {
    this.cbstService.mqttDisconect();
  }
  /* --------------------------------------- */

  /** Opción de lógica de botón atras */
  backClicked(): void {
    this.navigation.back();
  }
  /* --------------------------------------- */
}
