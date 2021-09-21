import { UtilsService } from 'src/app/shared/services/utils.service';
import { ElementRef, ViewEncapsulation } from '@angular/core';
import { ConsumptionService } from 'src/app/shared/services/api-consumer/consumptions.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ColorHelper, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { ConsultConsumptions } from 'src/app/shared/models/consult-consumptions';
import { Contract } from 'src/app/shared/models/contract';
import { Meter } from 'src/app/shared/models/meter';
import { ContractService } from 'src/app/shared/services/api-consumer/contract.service';
import { MeterService } from 'src/app/shared/services/api-consumer/meter.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {


  public consultConsumptions: Array<ConsultConsumptions>;
  public contracts: Array<Contract>;
  public contractNumberSelected: number;
  public meters: Array<Meter>;
  public meterNumberSelected: number;

  public items: Array<any>;

  public canvasWidth = 300;
  public needleValue = 0;
  public centralLabel = '';
  public options = {
    hasNeedle: true,
    needleColor: 'gray',
    needleUpdateSpeed: 1000,
    arcColors: ['#9AFF00', '#00D200', '#FFE702', '#FEAA33', '#FE1C59', '#C40250'],
    arcDelimiters: [16.6, 33.2, 49.8, 66.4, 83],
    rangeLabel: ['0', '100'],
    needleStartValue: 0,
  }

  // options
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public legendTitle = "Legenda";
  public showXAxisLabel = true;
  public xAxisLabel = 'Meses';
  public showYAxisLabel = true;
  public yAxisLabel = 'Consumos (m³)';
  public yScaleMax = 10;
  public yScaleMin = 0;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  public chartNames : Array<string>;
  public colors: ColorHelper;

  constructor(private consumptionService: ConsumptionService,
    private contractService: ContractService,
    private meterService: MeterService) {
  }

  ngOnInit(): void {
    this.getContracts();
  }

  public getContracts() {
    this.contractService.getDetailsByUser().subscribe(res => {
      this.contracts = res;
    });
  }

  public changeContract(event: any) {
    if (event.id) {
      let contractId = event.id;
      this.meterService.getByContract(contractId).subscribe(res => {
        this.meters = res;
      });
    }
  }

  public changeMeter() {
    debugger
    this.getConsumptions();
  }

  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.contractNumber.toString().indexOf(term) > -1 || item.description.toLocaleLowerCase().indexOf(term) > -1;
  }


  public getConsumptions() {
    this.consumptionService.getAllSumConsumptions(this.contractNumberSelected ?? null, this.meterNumberSelected ?? null).subscribe((res) => {
      debugger
      this.items = [];
      this.chartNames = [];
      if(res.length == 1){
        
        this.items.push({
          name: res[0].month,
          value: res[0].value
        });
        this.chartNames.push(this.items[0].month??new Date());
        
      }else{
        res.forEach(consumption => {
          if (consumption.month) {
            this.items.push({
              name: consumption.month,
              value: consumption.value
            });
            this.chartNames.push(consumption.month);
            
          }
        });
      }
      this.colors = new ColorHelper(this.colorScheme, ScaleType.Ordinal, this.chartNames, this.colorScheme);
    });

    this.consumptionService.getWeekSumConsumptions(this.contractNumberSelected ?? null, this.meterNumberSelected ?? null).subscribe((res) => {
      let max_value = res[0].max_value;
      let average = res[0].average;
      this.needleValue = (max_value == average) ? 0 : ( max_value == 0 || average == 0? 0 : Number( ( average * 100 ) /max_value ) );

    });

  }
}
