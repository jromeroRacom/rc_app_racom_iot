import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../../global/services/navigation.service';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  constructor(
    private navigation: NavigationService // Servicio de navegacion
  ) {}

  ngOnInit(): void {}

  backClicked(): void {
    this.navigation.back();
  }

}
