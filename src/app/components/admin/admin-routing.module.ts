import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FotaComponent } from './fota/fota.component';
import { DevicesListComponent } from './devices-list/devices-list.component';
import { DevicesTypesListComponent } from './devices-types-list/devices-types-list.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersRolesListComponent } from './users-roles-list/users-roles-list.component';
import { MqttAclListComponent } from './mqtt-acl-list/mqtt-acl-list.component';
import { MqttUsersListComponent } from './mqtt-users-list/mqtt-users-list.component';
import { UsersSessionsListComponent } from './users-sessions-list/users-sessions-list.component';
import { DeviceDetailsComponent } from './device-details/device-details.component';
import { UserDetailsComponent } from './user-details/user-details.component';

const routes: Routes = [
  { path: 'fota', component: FotaComponent },
  {
    path: 'users',
    children : [
      { path: 'details/:id', component: UserDetailsComponent },
      { path: 'list', component: UsersListComponent },
      { path: 'roles', component: UsersRolesListComponent},
      { path: 'sessions', component: UsersSessionsListComponent},
    ]
  },
  {
    path: 'devices',
    children : [
      { path: 'details/:serial', component: DeviceDetailsComponent },
      { path: 'types', component: DevicesTypesListComponent },
      { path: 'list', component: DevicesListComponent},
      {
        path: 'mqtt',
        children: [
          { path: 'acl', component: MqttAclListComponent },
          { path: 'users', component: MqttUsersListComponent },
        ]
      },
    ]
  },
  {
    path: '',
    redirectTo: 'app/home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
