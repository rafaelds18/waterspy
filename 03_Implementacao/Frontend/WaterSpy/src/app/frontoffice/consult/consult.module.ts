import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultRoutingModule } from './consult-routing.module';
import { ConsultContractsComponent } from './consult-contracts/consult-contracts.component';
import { ContractDetailsModalComponent } from './consult-contracts/contract-details-modal/contract-details-modal.component';
import { ConsultConsumptionsComponent } from './consult-consumptions/consult-consumptions.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GaugeChartModule } from 'angular-gauge-chart';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    ConsultContractsComponent,
    ContractDetailsModalComponent,
    ConsultConsumptionsComponent
  ],
  imports: [
    CommonModule,
    ConsultRoutingModule,
    SharedModule,
    NgxChartsModule,
    GaugeChartModule
  ]
})
export class ConsultModule { }
