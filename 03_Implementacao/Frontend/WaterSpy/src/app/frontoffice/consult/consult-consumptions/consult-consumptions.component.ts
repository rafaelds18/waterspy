import { Component, OnInit } from '@angular/core';
import { ConsumptionService } from 'src/app/shared/services/api-consumer/consumptions.service';
import { ColorHelper, ScaleType } from '@swimlane/ngx-charts';
import { Consumption } from 'src/app/shared/models/consumption';
import { ConsultConsumptions } from 'src/app/shared/models/consult-consumptions';
import { Contract } from 'src/app/shared/models/contract';
import { Meter } from 'src/app/shared/models/meter';
import { ContractService } from 'src/app/shared/services/api-consumer/contract.service';
import { MeterService } from 'src/app/shared/services/api-consumer/meter.service';

@Component({
  selector: 'app-consult-consumptions',
  templateUrl: './consult-consumptions.component.html',
  styleUrls: ['./consult-consumptions.component.scss']
})
export class ConsultConsumptionsComponent implements OnInit {

  public consultConsumptions: Array<ConsultConsumptions>;
  public contracts: Array<Contract>;
  public contractNumberSelected: number;
  public meters: Array<Meter>;
  public meterNumberSelected: number;

  public consumptions: Array<Consumption>;
  public consumptionMonth: Array<any>;
  public consumptionWeek: Array<any>;
  public months: Array<any>;

  public monthOption: number;
  public month: any;
  public multiValues = false;
  public multiValuesMonth = false;

  public haveConsumptions: boolean = false;
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
    needleStartValue: 50,
  }

  view: [number, number] = [700, 400];


  // options
  public showLabels: boolean = true;
  public animations: boolean = true;
  public xAxis: boolean = true;
  public yAxis: boolean = true;
  public showYAxisLabel: boolean = true;
  public showXAxisLabel: boolean = true;
  public xAxisLabel: string = 'Dia';
  public yAxisLabel: string = 'Consumo(m³)';
  public timeline: boolean = true;
  public showGridLines: boolean = false;
  public gradient: boolean = true;
  public legendTitle = "Legenda";
  public yScaleMax = 10;
  public yScaleMin = -0.5;
  public xScaleMax = 10;
  public xScaleMin = -0.5;

  public chartNamesWeek : Array<string>;
  public colorsWeek: ColorHelper;
  public chartNamesMonth: Array<string>;
  public colorsMonth: ColorHelper;
  
  colorScheme = {
    domain: ['#0066cc']
  };

  constructor(private consumptionService: ConsumptionService,
    private contractService: ContractService,
    private meterService: MeterService) {}

  ngOnInit(): void {
    this.getContracts();
    this.months = this.getMonths();
    this.monthOption = this.getCurrentMonth();
  }
  
  public getContracts() {
    this.contractService.getDetailsByUser().subscribe(res => {
      this.contracts = res;
    });
  }

  public getConsumptions() {
    this.getAllWeekConsumptions();
    this.getConsumptionsByMonth();
  }

  public search() {
    this.getConsumptions();
  }

  public changeContract(event: any) {
    if (event.id) {
      let contractId = event.id;
      this.meterService.getByContract(contractId).subscribe(res => {
        this.meters = res;
      });
    }
  }

  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.contractNumber.toString().indexOf(term) > -1 || item.description.toLocaleLowerCase().indexOf(term) > -1;
  }

  public getAllWeekConsumptions(){
    this.chartNamesWeek = [];
    this.consumptionService.getAllWeekConsumptions(this.contractNumberSelected ?? null, this.meterNumberSelected ?? null).subscribe((res) => {
      this.haveConsumptions = true;
      this.consumptionWeek = res;
      let series = JSON.parse(JSON.stringify(this.consumptionWeek[0].series));

      if (series.length > 1) {
        this.consumptionWeek[0].series[0].value = 0;
        for (let index = 1; index < series.length; index++) {
          let value:number = 0;
          value = Math.abs( series[index].value - series[index-1].value);
          this.consumptionWeek[0].series[index].value = value;
        }
      }

      /*************************************/
      this.multiValues = (series.length < 2) ? false : true;
      if (this.multiValues) {
        this.consumptionWeek.forEach(cons =>{
          this.chartNamesWeek.push(cons.name);
        });
        this.colorsWeek = new ColorHelper(this.colorScheme, ScaleType.Ordinal, this.chartNamesWeek, this.colorScheme);
      } else {
        if (series.length == 0) {
          series = [
            {
              name: new Date() + "",
              x: new Date() + "",
              y: 0,
              r: 0
            }
          ];
          this.chartNamesWeek.push(res[0].name);
        } else {
          series = [
            {
              name: res[0].series[0].name,
              x: res[0].series[0].name,
              y: 0,
              r: 0
            }
          ];
          this.chartNamesWeek.push(res[0].name);
        }

        res[0].series = series;
        this.consumptionWeek = res;
        this.colorsWeek = new ColorHelper(this.colorScheme, ScaleType.Ordinal, this.chartNamesWeek, this.colorScheme);
      }
      
    });
  }

  public getConsumptionsByMonth(){
    
    this.chartNamesMonth = [];
    this.consumptionService.getConsumptionsByMonth(this.monthOption, this.contractNumberSelected ?? null, this.meterNumberSelected ?? null).subscribe((res) => {
      debugger
      this.consumptionMonth = res;
      let series = JSON.parse(JSON.stringify(this.consumptionMonth[0].series));

      if (series.length > 1) {
        this.consumptionMonth[0].series[0].value = 0;
        for (let index = 1; index < series.length; index++) {
          let value:number = 0;
          value = Math.abs( series[index].value - series[index-1].value);
          this.consumptionMonth[0].series[index].value = value;
        }
      }

      this.multiValuesMonth = (res[0].series.length < 2) ? false : true;
      if (this.multiValuesMonth) {
        this.consumptionMonth.forEach(cons =>{
          this.chartNamesMonth.push(cons.name);
        });
        this.colorsMonth = new ColorHelper(this.colorScheme, ScaleType.Ordinal, this.chartNamesMonth, this.colorScheme);
      
      } else {
        let series;
        if (res[0].series.length == 0) {
          series = [
            {
              name: new Date() + "",
              x: new Date() + "",
              y: 0,
              r: 0
            }
          ];
          this.chartNamesMonth.push(series[0].name);
        } else {
          series = [
            {
              name: res[0].series[0].name,
              x: res[0].series[0].name,
              y: 0,
              r: 0
            }
          ];
          this.chartNamesMonth.push(series[0].name);
        }

        res[0].series = series;
        this.consumptionMonth = res;
        this.colorsMonth = new ColorHelper(this.colorScheme, ScaleType.Ordinal, this.chartNamesMonth, this.colorScheme);

      }
    });
  }

  getMonths(): any {
    return [
      {
        id: 1,
        name: "Janeiro"
      },
      {
        id: 2,
        name: "Fevereiro"
      },
      {
        id: 3,
        name: "Março"
      },
      {
        id: 4,
        name: "Abril"
      },
      {
        id: 5,
        name: "Maio"
      },
      {
        id: 6,
        name: "Junho"
      },
      {
        id: 7,
        name: "Julho"
      },
      {
        id: 8,
        name: "Agosto"
      },
      {
        id: 9,
        name: "Setembro"
      },
      {
        id: 10,
        name: "Outubro"
      },
      {
        id: 11,
        name: "Novembro"
      },
      {
        id: 12,
        name: "Dezembro"
      }
    ]
  }

  public getCurrentMonth() {
    let month = new Date().getMonth();
    return this.months.find(x => x.id == month + 1).id;
  }
}
