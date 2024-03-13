import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarouselModule } from 'ngx-owl-carousel-o';
import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from '../shared/shared.module';

import { AccountComponent } from './account/account.component';
import { BlankComponent } from './blank/blank.component';
import { ListDevicesComponent } from './list-devices/list-devices.component';
import { HomeComponent } from './home/home.component';
import { DeviceSelectorDialogComponent } from './home/dialogs/device-selector-dialog/device-selector-dialog.component';
import { AccountDialogComponent } from './account/dialogs/account-dialog/account-dialog.component';
import { DeleteAccountComponent } from './account/dialogs/delete-account/delete-account.component';
import { DevicesTableComponent } from './tables/devices-table/devices-table.component';
import { UserDevicesTableComponent } from './tables/user-devices-table/user-devices-table.component';

@NgModule({
  declarations: [
    AccountComponent,
    BlankComponent,
    ListDevicesComponent,
    HomeComponent,
    DeviceSelectorDialogComponent,
    AccountDialogComponent,
    DeleteAccountComponent,
    DevicesTableComponent,
    UserDevicesTableComponent
  ],
  imports: [CommonModule, MainRoutingModule, SharedModule, CarouselModule],
  exports: []
})
export class MainModule {}
