import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../../global/services/navigation.service';

@Component({
  selector: 'app-mqtt-acl-list',
  templateUrl: './mqtt-acl-list.component.html',
  styleUrls: ['./mqtt-acl-list.component.scss']
})
export class MqttAclListComponent implements OnInit {

  constructor(
    private navigation: NavigationService // Servicio de navegacion
  ) {}

  ngOnInit(): void {}

  backClicked(): void {
    this.navigation.back();
  }

}
