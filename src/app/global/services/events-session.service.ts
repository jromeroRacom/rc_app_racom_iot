import { Injectable } from '@angular/core';

export class SessionEvent {
  type: string;
  origin?: string;
  timestamp?: Date;

  constructor(){
    this.type = 'none'; this.origin = ''; this.timestamp = new Date();
  }
}

@Injectable({
  providedIn: 'root'
})
export class EventsSessionService {

  sessionEvents: SessionEvent[] = [];

  /** Constructor */
  constructor() { }
  /* --------------------------------------- */

  /**
   * Agrega evento de sesión
   * @param event Evento de tipo SessionEvent
   */
  addSessionEvent(event: SessionEvent): void{
    this.sessionEvents.push(event);
  }
  /* --------------------------------------- */

  /**
   * Obtiene los eventos de sessión
   * @returns Eventos de tipo SessionEvent
   */
  getSessionEvents(): SessionEvent[]{
    return this.sessionEvents;
  }
  /* --------------------------------------- */

  /**
   * Obtiene el primer evento de session alojado
   * @returns Evento de tipo SessionEvent
   */
  getFirstSessionEvent(): SessionEvent {
    const len = this.sessionEvents.length || 0;
    if (len > 0){ return this.sessionEvents[0];
    }else{ return new SessionEvent(); }
  }
  /* --------------------------------------- */

  /** Borra eventos de sesión */
  deleteSessionEvents(): void{
    this.sessionEvents = [];
  }
  /* --------------------------------------- */
}
