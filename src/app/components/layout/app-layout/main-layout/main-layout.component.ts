import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';



@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: []
})
export class MainLayoutComponent implements OnInit {
  public  secToIdle: number =  environment.secToIdle || 900;          // Segundos para disparar IDLE
  public secToCloseIdle: number = environment.secToCloseIdle || 15;   // Segundos para cerrar idle despues de activarse
  constructor() {}

  ngOnInit(): void {}
}
