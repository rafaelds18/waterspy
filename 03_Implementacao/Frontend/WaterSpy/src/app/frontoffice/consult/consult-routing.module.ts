import { ConsultConsumptionsComponent } from './consult-consumptions/consult-consumptions.component';
import { ConsultContractsComponent } from './consult-contracts/consult-contracts.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'contracts',
    component: ConsultContractsComponent
  },
  {
    path: 'consumptions',
    component: ConsultConsumptionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultRoutingModule { }
