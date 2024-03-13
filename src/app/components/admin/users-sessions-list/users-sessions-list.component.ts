import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../../global/services/navigation.service';

@Component({
  selector: 'app-users-sessions-list',
  templateUrl: './users-sessions-list.component.html',
  styleUrls: ['./users-sessions-list.component.scss']
})
export class UsersSessionsListComponent implements OnInit {

  constructor(
    private navigation: NavigationService // Servicio de navegacion
  ) {}

  ngOnInit(): void {}

  backClicked(): void {
    this.navigation.back();
  }

}
