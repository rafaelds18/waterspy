import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule } from './register-routing.module';
import { ContractsComponent } from './contracts/contracts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MeterComponent } from './meter/meter.component';


@NgModule({
  declarations: [
    ContractsComponent,
    MeterComponent
  ],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    SharedModule
  ]
})
export class RegisterModule { }
