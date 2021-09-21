import { SendNotificationsComponent } from './send-notifications/send-notifications.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { ConsultConsumptionsComponent } from './consult-consumptions/consult-consumptions.component';
import { ManageSuppliersComponent } from './manage-suppliers/manage-suppliers.component';

const routes: Routes = [
  {
    path: 'suppliers',
    component: ManageSuppliersComponent,
    canActivate: [AuthGuard, RolesGuard],
    data: {
      roles: ['Admin']
    }
  },
  {
    path: 'consult-consumptions',
    component: ConsultConsumptionsComponent,
    canActivate: [AuthGuard, RolesGuard],
    data: {
      roles: ['Admin']
    }
  },
  {
    path: 'send-notifications',
    component: SendNotificationsComponent,
    canActivate: [AuthGuard, RolesGuard],
    data: {
      roles: ['Admin']
    }
  },
  {
    path: 'manage-users',
    component: ManageUsersComponent,
    canActivate: [AuthGuard, RolesGuard],
    data: {
      roles: ['Admin']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }
