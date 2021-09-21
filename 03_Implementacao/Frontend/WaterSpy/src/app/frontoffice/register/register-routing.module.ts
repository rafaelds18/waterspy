import { MeterComponent } from './meter/meter.component';
import { ContractsComponent } from './contracts/contracts.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'contracts',
    component: ContractsComponent
  },
  {
    path: 'meters',
    component: MeterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule { }
