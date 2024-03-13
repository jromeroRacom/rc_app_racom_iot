import { Injectable } from '@angular/core';
import { InConfiguration } from '../global/models/config.interface';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public configData !: InConfiguration;

  constructor() {
    this.setConfigData();
  }

  setConfigData(): void {
    this.configData = {
      layout: {
        variant: 'light', // options:  light & dark
        theme_color: 'black', // options:  white, black, purple, blue, cyan, green, orange
        logo_bg_color: 'white', // options:  white, black, purple, blue, cyan, green, orange
        sidebar: {
          collapsed: false, // options:  true & false
          backgroundColor: 'light' // options:  light & dark
        }
      }
    };
  }
}
