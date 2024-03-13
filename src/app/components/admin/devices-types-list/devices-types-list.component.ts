import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../../global/services/navigation.service';

@Component({
  selector: 'app-devices-types-list',
  templateUrl: './devices-types-list.component.html',
  styleUrls: ['./devices-types-list.component.scss']
})
export class DevicesTypesListComponent implements OnInit {

  constructor(
    private navigation: NavigationService // Servicio de navegacion
  ) {}

  ngOnInit(): void {}

  backClicked(): void {
    this.navigation.back();
  }

}
