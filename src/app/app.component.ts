import { Component, OnDestroy } from '@angular/core';
import { Event, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PlatformLocation } from '@angular/common';
import { NavigationService } from './global/services/navigation.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  currentUrl = '';
  constructor(
    public router: Router,
    private navigation: NavigationService
  ) {
    this.navigation.init();
  }

  ngOnDestroy(): void {
    this.navigation.destroy();
  }
}
