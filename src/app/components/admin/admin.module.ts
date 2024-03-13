import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { FotaComponent } from './fota/fota.component';
import { SharedModule } from '../shared/shared.module';
import { FirmwaresTableComponent } from './tables/firmwares-table/firmwares-table.component';
import { UsersTableComponent } from './tables/users-table/users-table.component';
import { RolesTableComponent } from './tables/roles-table/roles-table.component';
import { DevicesTableComponent } from './tables/devices-table/devices-table.component';
import { UsersListComponent } from './users-list/users-list.component';
import { DevicesListComponent } from './devices-list/devices-list.component';
import { DevicesTypesListComponent } from './devices-types-list/devices-types-list.component';
import { UsersRolesListComponent } from './users-roles-list/users-roles-list.component';
import { DevicesTypesTableComponent } from './tables/devices-types-table/devices-types-table.component';
import { SessionsTableComponent } from './tables/sessions-table/sessions-table.component';
import { MqttUsersTableComponent } from './tables/mqtt-users-table/mqtt-users-table.component';
import { MqttAclTableComponent } from './tables/mqtt-acl-table/mqtt-acl-table.component';
import { UsersSessionsListComponent } from './users-sessions-list/users-sessions-list.component';
import { MqttAclListComponent } from './mqtt-acl-list/mqtt-acl-list.component';
import { MqttUsersListComponent } from './mqtt-users-list/mqtt-users-list.component';
import { AddFirmwareDialogComponent } from './tables/firmwares-table/dialogs/add-firmware-dialog/add-firmware-dialog.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { AddDeviceTypeDialogComponent } from './tables/devices-types-table/dialogs/add-device-type-dialog/add-device-type-dialog.component';
import { AddMqttUserDialogComponent } from './tables/mqtt-users-table/dialogs/add-mqtt-user-dialog/add-mqtt-user-dialog.component';
import { AddMqttAclDialogComponent } from './tables/mqtt-acl-table/dialogs/add-mqtt-acl-dialog/add-mqtt-acl-dialog.component';
import { AddDeviceDialogComponent } from './tables/devices-table/dialogs/add-device-dialog/add-device-dialog.component';
import { AddRoleDialogComponent } from './tables/roles-table/dialogs/add-role-dialog/add-role-dialog.component';
import { AddUserDialogComponent } from './tables/users-table/dialogs/add-user-dialog/add-user-dialog.component';
import { DeviceDetailsComponent } from './device-details/device-details.component';
import { UserDetailsComponent } from './user-details/user-details.component';

@NgModule({
  declarations: [
    FotaComponent,
    FirmwaresTableComponent,
    UsersTableComponent,
    RolesTableComponent,
    DevicesTableComponent,
    UsersListComponent,
    DevicesListComponent,
    DevicesTypesListComponent,
    UsersRolesListComponent,
    DevicesTypesTableComponent,
    SessionsTableComponent,
    MqttUsersTableComponent,
    MqttAclTableComponent,
    UsersSessionsListComponent,
    MqttAclListComponent,
    MqttUsersListComponent,
    AddFirmwareDialogComponent,
    AddDeviceTypeDialogComponent,
    AddMqttUserDialogComponent,
    AddMqttAclDialogComponent,
    AddDeviceDialogComponent,
    AddRoleDialogComponent,
    AddUserDialogComponent,
    DeviceDetailsComponent,
    UserDetailsComponent
  ],
  imports: [CommonModule, AdminRoutingModule, SharedModule, MaterialFileInputModule]
})
export class AdminModule {}
