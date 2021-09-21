import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackofficeRoutingModule } from './backoffice-routing.module';
import { ManageSuppliersComponent } from './manage-suppliers/manage-suppliers.component';
import { SharedModule } from '../shared/shared.module';
import { ConsultConsumptionsComponent } from './consult-consumptions/consult-consumptions.component';
import { SendNotificationsComponent } from './send-notifications/send-notifications.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { SendNotificationModalComponent } from './send-notifications/send-notification-modal/send-notification-modal.component';


@NgModule({
  declarations: [
    ManageSuppliersComponent,
    ConsultConsumptionsComponent,
    SendNotificationsComponent,
    ManageUsersComponent,
    SendNotificationModalComponent
  ],
  imports: [
    CommonModule,
    BackofficeRoutingModule,
    SharedModule
  ]
})
export class BackofficeModule { }
