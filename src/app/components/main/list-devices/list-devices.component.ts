import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../../global/services/navigation.service';

@Component({
  selector: 'app-list-devices',
  templateUrl: './list-devices.component.html',
  styleUrls: ['./list-devices.component.scss']
})
export class ListDevicesComponent implements OnInit {
  constructor(
    private navigation: NavigationService // Servicio de navegacion
  ) {}

  ngOnInit(): void {}

  backClicked(): void {
    this.navigation.back();
  }
}
