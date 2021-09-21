import { SendConsumptionsComponent } from './send-consumptions/send-consumptions.component';
import { RolesGuard } from './../shared/guards/roles.guard';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard, RolesGuard],
    data: {
      roles: ['Consumer']
    }
  },
  {
    path: 'sendConsumptions',
    component: SendConsumptionsComponent,
    canActivate: [AuthGuard, RolesGuard],
    data: {
      roles: ['Consumer']
    }
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterModule),
    canActivate: [AuthGuard, RolesGuard],
    data: {
      roles: ['Consumer']
    }
  },
  {
    path: 'consult',
    loadChildren: () => import('./consult/consult.module').then(m => m.ConsultModule),
    canActivate: [AuthGuard, RolesGuard],
    data: {
      roles: ['Consumer']
    }
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notification/notification.module').then(m => m.NotificationModule),
    canActivate: [AuthGuard, RolesGuard],
    data: {
      roles: ['Consumer']
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontofficeRoutingModule { }
