import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Component, Inject, ElementRef, OnInit, Renderer2, HostListener, OnDestroy} from '@angular/core';

import { ROUTES } from './sidebar-items';

import { AuthTokenService } from 'src/app/global/services/auth-token.service';
import { RouteInfo } from './sidebar.metadata';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  public sidebarItems: RouteInfo[] = [];   // Items para menú
  public level1Menu = '';                  // Nivel 1 de menú
  public level2Menu = '';                  // Nivel 2 de menú
  public level3Menu = '';                  // Nivel 3 de menú
  public innerHeight: any;                 // Obtiene tamañó de ventana
  public bodyTag: any;                     // Variable de referencia de body
  public listMaxHeight!: string;           // Altura máxima
  public listMaxWidth!: string;            // Anchura máxima
  public headerHeight = 60;                // Altura de header
  public routerObj;                        // Objeto para ruta

  private actualRole = 'none';              // Tipo de rol
  private arrayRoles: string[] = [];        // Array de roles
  public userName = '';                    // Nombre de usuario

  /** Constructor */
  constructor(
    @Inject(DOCUMENT) private document: Document, // Referencia de document
    private renderer: Renderer2,                  // Reverencia de View
    public elementRef: ElementRef,                // Referencia de html
    private authTokenService: AuthTokenService,   // Servicio de token
    private router: Router                        // Manejador de rutas
  ) {
    this.routerObj = this.router.events.subscribe((event) => {  // Logica para obtener ruta áctiva
      if (event instanceof NavigationEnd) {
        const currenturl: string = event.url.split('?')[0];   // Corta los querys

        /** @note Parche para que funcione con mis rutas de app y de admin */
        if (currenturl.includes('app/admin')){
          this.level1Menu = currenturl.split('/')[3];   // Obtiene primer nivel
          this.level2Menu = currenturl.split('/')[4];   // Obtiene segundo nivel
        }else{
          this.level1Menu = currenturl.split('/')[2];   // Obtiene primer nivel
          this.level2Menu = currenturl.split('/')[3];   // Obtiene segundo nivel
        }
        /** --------------------------------------------------------------- */

        this.renderer.removeClass(this.document.body, 'overlay-open');  // Cierra sidebar en moviles despues de selecionar
      }
    });
  }
  /* --------------------------------------- */

  /** Ciclo de vida de Inicio */
  ngOnInit(): void {
    if (!this.authTokenService.isTokenExpired()) {                      // Si el token existe y no ha expirado
      this.sidebarItems = ROUTES.filter((sidebarItem) => sidebarItem);  // Obtiene items de menú
    }
    this.userName = this.authTokenService.getUserNameFromToken() || 'none'; // obtiene nombre de usuario
    this.getRoleType();                                                 // Obtiene rol para permisos

    this.initLeftSidebar();                                             // Inicializa sidebar
    this.bodyTag = this.document.body;                                  // Obtiene body
  }
  /* --------------------------------------- */

  /** Ciclo de vida de Fin */
  ngOnDestroy(): void {
    if ( this.routerObj){this.routerObj.unsubscribe(); }  // Elimina subscripción
  }
  /* --------------------------------------- */

  /**
   * Obtiene dimension de menú
   * @param event Evento de resize
   */
  @HostListener('window:resize', ['$event'])   // Decorador de host
  windowResizecall(event: any): void {
    this.setMenuHeight();               // Establece alto de menú
    this.checkStatuForResize(false);    // Checa estatus de redimensión
  }
  /* --------------------------------------- */


  /**
   * Lógica al click mouse
   * @param event  Evento de mousedown
   */
  @HostListener('document:mousedown', ['$event'])    // Decorador de host
  onGlobalClick(event: any): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {    // Quita menú visible
      this.renderer.removeClass(this.document.body, 'overlay-open');
    }
  }
  /* --------------------------------------- */

  /**
   * Lógica para toggle de nivel 1
   * @param event evento disparado por html
   * @param element nombre de módulo disparado
   */
  callLevel1Toggle(event: any, element: any): void {
    if (element === this.level1Menu) {
      this.level1Menu = '0';
    } else {
      this.level1Menu = element;
    }
    const hasClass = event.target.classList.contains('toggled');
    if (hasClass) {
      this.renderer.removeClass(event.target, 'toggled');
    } else {
      this.renderer.addClass(event.target, 'toggled');
    }
  }
  /* --------------------------------------- */

  /**
   * Lógica para toggle de nivel 2
   * @param event evento disparado por html
   * @param element nombre de módulo disparado
   */
  callLevel2Toggle(event: any, element: any): void {
    if (element === this.level2Menu) {
      this.level2Menu = '0';
    } else {
      this.level2Menu = element;
    }
  }
  /* --------------------------------------- */

   /**
    * Lógica para toggle de nivel 3
    * @param event evento disparado por html
    * @param element nombre de módulo disparado
    */
  callLevel3Toggle(event: any, element: any): void {
    if (element === this.level3Menu) {
      this.level3Menu = '0';
    } else {
      this.level3Menu = element;
    }
  }
  /* --------------------------------------- */


  /** Inicializa menú */
  initLeftSidebar(): void {
    const mthis = this;
    mthis.setMenuHeight();
    mthis.checkStatuForResize(true);
  }
  /* --------------------------------------- */

  /** Establece altura de manú */
  setMenuHeight(): void {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height + '';
    this.listMaxWidth = '500px';
  }
  /* --------------------------------------- */

  /** Obtiene si menú esta abierto */
  isOpen(): void {
    return this.bodyTag.classList.contains('overlay-open');
  }
  /* --------------------------------------- */

  /** Checa estatus de redimensión */
  checkStatuForResize(firstTime: any): void {
    if (window.innerWidth < 1170) {
      this.renderer.addClass(this.document.body, 'ls-closed');
    } else {
      this.renderer.removeClass(this.document.body, 'ls-closed');
    }
  }
  /* --------------------------------------- */

  /** Lógica de mouse hover */
  mouseHover(e: any): void {
    const body = this.elementRef.nativeElement.closest('body');

    if (body.classList.contains('submenu-closed')) {
      this.renderer.addClass(this.document.body, 'side-closed-hover');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    }
  }
  /* --------------------------------------- */

  /** Lógica de mouse out */
  mouseOut(e: any): void {
    const body = this.elementRef.nativeElement.closest('body');

    if (body.classList.contains('side-closed-hover')) {
      this.renderer.removeClass(this.document.body, 'side-closed-hover');
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }
  /* --------------------------------------- */

  /** Obtiene tipo de role segun role de JWT */
  private getRoleType(): void{
    const roleJWT = this.authTokenService.getRolFromToken() || 'none';

    switch (roleJWT){
      case 'USER_ROLE': this.actualRole = 'user'; break;
      case 'ADMIN_ROLE': this.actualRole = 'admin'; break;
      default: this.actualRole = 'none'; break;
    }

    this.arrayRoles.push('all');              // Pone default all en arreglo de roles
    this.arrayRoles.push(this.actualRole);    // Pone rol actual en arreglo de roles
  }

  /* --------------------------------------- */

  /** Obtiene si tiene permisos basado en role */
  public isRoleValid(item: string[]): boolean{
    let valid = 0;

    item.forEach(element => {                                         // Barre arreglo de roles de item
      valid = valid + (this.arrayRoles.includes(element) ? 1 : 0);    // Suma si tiene permisos
    });

    return (valid) ? true : false;   // Si al menos uno tiene , regresa true
  }

  /* --------------------------------------- */

}
