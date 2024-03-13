import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../../global/services/navigation.service';

@Component({
  selector: 'app-mqtt-users-list',
  templateUrl: './mqtt-users-list.component.html',
  styleUrls: ['./mqtt-users-list.component.scss']
})
export class MqttUsersListComponent implements OnInit {

  constructor(
    private navigation: NavigationService // Servicio de navegacion
  ) {}

  ngOnInit(): void {}

  backClicked(): void {
    this.navigation.back();
  }

}
