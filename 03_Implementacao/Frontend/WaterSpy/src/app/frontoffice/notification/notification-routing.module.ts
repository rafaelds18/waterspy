import { NotificationComponent } from './notification/notification.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { RolesGuard } from 'src/app/shared/guards/roles.guard';

const routes: Routes = [  
  {
    path: '',
    component: NotificationComponent,
    canActivate: [AuthGuard, RolesGuard],
    data: {
      roles: ['Consumer']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
