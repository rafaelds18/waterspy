import { SharedModule } from './../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { SendConsumptionsComponent } from './send-consumptions/send-consumptions.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontofficeRoutingModule } from './frontoffice-routing.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GaugeChartModule } from 'angular-gauge-chart';


@NgModule({
  declarations: [
    SendConsumptionsComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    FrontofficeRoutingModule,
    SharedModule,
    NgxChartsModule,
    GaugeChartModule
  ]
})
export class FrontofficeModule { }
