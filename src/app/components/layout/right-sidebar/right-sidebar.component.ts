import { DOCUMENT } from '@angular/common';
import { Component, Inject, ElementRef, OnInit, AfterViewInit, Renderer2, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

import { UserIdleService, UserIdleConfig } from 'angular-user-idle';

import { RightSidebarService } from 'src/app/core/service/rightsidebar.service';
import { ConfigService } from 'src/app/config/config.service';
import { AuthTokenService } from 'src/app/global/services/auth-token.service';


@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RightSidebarComponent implements OnInit, AfterViewInit, OnDestroy {
  selectedBgColor = 'white';   // Variable para detrminar skin
  maxHeight!: string;          // Variable para determinar el máximo alto de menú
  maxWidth!: string;           // Variable para determinar el máximo ancho de menú
  showpanel = false;           // Flag para visualizar menú
  isOpenSidebar: boolean;      // Determina el estado de menú
  isDarkSidebar = false;       // Determina si esta en modo dark
  isDarkTheme = false;          // Determina si el tema es dark
  timeExpiration: Date | undefined;  // Hora en la que expira la sessión
  timeLogin: Date | undefined;       // Hora de inicio de sesión
  timeIdle: number;            // Tiempo de inactividad para mostrar
  timeIdleMin: number;         // Tiempo de inactividad en minutos
  public config: any = {};

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private dataService: RightSidebarService,
    private configService: ConfigService,
    private userIdle: UserIdleService,
    private authTokenService: AuthTokenService,   // Servicio de token
  ) {
    this.isOpenSidebar = false;
    this.timeIdle = 0;        // Inicializa timeIdle
    this.timeIdleMin = 0;     // Inicializa timeIdle en minutos
  }

  ngOnInit(): void {
    this.config = this.configService.configData;                   // Obtiene config inicial
    this.dataService.currentStatus.subscribe((data: boolean) => {  // Se subscribe a servicio de menú derecha
      this.isOpenSidebar = data;                                   // Obtiene si está abierto
      this.refreshSessionValues();                                 // Actualiza valores a imprimir
    });
    this.setRightSidebarWindowHeight();                           // Establece alto máximo
  }

  ngAfterViewInit(): void {
    // set header color on startup
    if (localStorage.getItem('choose_skin')) {
      this.renderer.addClass(
        this.document.body,
        localStorage.getItem('choose_skin') || ''
      );
      this.selectedBgColor = localStorage.getItem('choose_skin_active') || '';
    } else {
      this.renderer.addClass(
        this.document.body,
        'theme-' + this.config.layout.theme_color
      );
      this.selectedBgColor = this.config.layout.theme_color;
    }

    if (localStorage.getItem('menuOption')) {
      if (localStorage.getItem('menuOption') === 'menu_dark') {
        this.isDarkSidebar = true;
      } else if (localStorage.getItem('menuOption') === 'menu_light') {
        this.isDarkSidebar = false;
      } else {
        this.isDarkSidebar =
          this.config.layout.sidebar.backgroundColor === 'dark' ? true : false;
      }
    } else {
      this.isDarkSidebar =
        this.config.layout.sidebar.backgroundColor === 'dark' ? true : false;
    }

    if (localStorage.getItem('theme')) {
      if (localStorage.getItem('theme') === 'dark') {
        this.isDarkTheme = true;
      } else if (localStorage.getItem('theme') === 'light') {
        this.isDarkTheme = false;
      } else {
        this.isDarkTheme = this.config.layout.variant === 'dark' ? true : false;
      }
    } else {
      this.isDarkTheme = this.config.layout.variant === 'dark' ? true : false;
    }
  }

  ngOnDestroy(): void{
    this.dataService.deleteSkinChange();   // Termina observable de skin
  }

  selectTheme(e: any): void {
    if (e !== this.selectedBgColor  ){ this.dataService.setNewSkinChange(e); }     // Evento de cambio de color
    this.selectedBgColor = e;
    const prevTheme = this.elementRef.nativeElement
      .querySelector('.right-sidebar .demo-choose-skin li.actived')
      .getAttribute('data-theme');
    this.renderer.removeClass(this.document.body, 'theme-' + prevTheme);
    this.renderer.addClass(this.document.body, 'theme-' + this.selectedBgColor);
    localStorage.setItem('choose_skin', 'theme-' + this.selectedBgColor);
    localStorage.setItem('choose_skin_active', this.selectedBgColor);
  }
  lightSidebarBtnClick(): void {
    this.renderer.removeClass(this.document.body, 'menu_dark');
    this.renderer.removeClass(this.document.body, 'logo-black');
    this.renderer.addClass(this.document.body, 'menu_light');
    this.renderer.addClass(this.document.body, 'logo-white');
    const menuOption = 'menu_light';
    localStorage.setItem('choose_logoheader', 'logo-white');
    localStorage.setItem('menuOption', menuOption);
  }
  darkSidebarBtnClick(): void {
    this.renderer.removeClass(this.document.body, 'menu_light');
    this.renderer.removeClass(this.document.body, 'logo-white');
    this.renderer.addClass(this.document.body, 'menu_dark');
    this.renderer.addClass(this.document.body, 'logo-black');
    const menuOption = 'menu_dark';
    localStorage.setItem('choose_logoheader', 'logo-black');
    localStorage.setItem('menuOption', menuOption);
  }
  lightThemeBtnClick(): void {
    this.renderer.removeClass(this.document.body, 'dark');
    this.renderer.removeClass(this.document.body, 'submenu-closed');
    this.renderer.removeClass(this.document.body, 'menu_dark');
    this.renderer.removeClass(this.document.body, 'logo-black');

    if (localStorage.getItem('choose_skin')) {
      this.renderer.removeClass(
        this.document.body,
        localStorage.getItem('choose_skin') || ''
      );
    } else {
      this.renderer.removeClass(
        this.document.body,
        'theme-' + this.config.layout.theme_color
      );
    }

    this.renderer.addClass(this.document.body, 'light');
    this.renderer.addClass(this.document.body, 'submenu-closed');
    this.renderer.addClass(this.document.body, 'menu_light');
    this.renderer.addClass(this.document.body, 'logo-white');
    this.renderer.addClass(this.document.body, 'theme-white');
    const theme = 'light';
    const menuOption = 'menu_light';
    this.selectedBgColor = 'white';
    this.isDarkSidebar = false;
    localStorage.setItem('choose_logoheader', 'logo-white');
    localStorage.setItem('choose_skin', 'theme-white');
    localStorage.setItem('theme', theme);
    localStorage.setItem('menuOption', menuOption);
  }
  darkThemeBtnClick(): void {
    this.renderer.removeClass(this.document.body, 'light');
    this.renderer.removeClass(this.document.body, 'submenu-closed');
    this.renderer.removeClass(this.document.body, 'menu_light');
    this.renderer.removeClass(this.document.body, 'logo-white');
    if (localStorage.getItem('choose_skin')) {
      this.renderer.removeClass(
        this.document.body,
        localStorage.getItem('choose_skin') || ''
      );
    } else {
      this.renderer.removeClass(
        this.document.body,
        'theme-' + this.config.layout.theme_color
      );
    }
    this.renderer.addClass(this.document.body, 'dark');
    this.renderer.addClass(this.document.body, 'submenu-closed');
    this.renderer.addClass(this.document.body, 'menu_dark');
    this.renderer.addClass(this.document.body, 'logo-black');
    this.renderer.addClass(this.document.body, 'theme-black');
    const theme = 'dark';
    const menuOption = 'menu_dark';
    this.selectedBgColor = 'black';
    this.isDarkSidebar = true;
    localStorage.setItem('choose_logoheader', 'logo-black');
    localStorage.setItem('choose_skin', 'theme-black');
    localStorage.setItem('theme', theme);
    localStorage.setItem('menuOption', menuOption);
  }

  setRightSidebarWindowHeight(): void {
    const height = window.innerHeight - 137;
    this.maxHeight = height + '';
    this.maxWidth = '500px';
  }
  onClickedOutside(event: Event): void {
    const button = event.target as HTMLButtonElement;
    if (button.id !== 'settingBtn') {
      if (this.dataService.currentStatus._isScalar === true) {
        this.toggleRightSidebar();
      }
    }
  }
  toggleRightSidebar(): void {
    this.dataService.changeMsg(
      (this.dataService.currentStatus._isScalar = !this.dataService
        .currentStatus._isScalar)
    );
  }


  /* Agregadas por mi */
  refreshSessionValues(): void{
    this.timeExpiration = this.authTokenService.getTokenExpirationDate();    // Obtiene tiempo de expiraxion de token
    this.timeLogin = this.authTokenService.getTimeLogin();                   // Obtiene el tiempo del login inicial
    this.timeIdle = Number(this.userIdle.getConfigValue().idle) / 1000;       // Obtiene tiempo de inactividad segundos
    this.timeIdleMin = Number((this.timeIdle / 60).toFixed(2));              // Obtiene tiempo de inactividad minutos
  }
}
