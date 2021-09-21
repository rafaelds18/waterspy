import { MeterService } from 'src/app/shared/services/api-consumer/meter.service';
import { ContractService } from 'src/app/shared/services/api-consumer/contract.service';
import { Component, OnInit } from '@angular/core';
import { ConsultConsumptions } from 'src/app/shared/models/consult-consumptions';
import { Consumption } from 'src/app/shared/models/consumption';
import { ConsumptionService } from 'src/app/shared/services/api-consumer/consumptions.service';
import { Contract } from 'src/app/shared/models/contract';
import { Meter } from 'src/app/shared/models/meter';

@Component({
  selector: 'app-consult-consumptions',
  templateUrl: './consult-consumptions.component.html',
  styleUrls: ['./consult-consumptions.component.scss']
})
export class ConsultConsumptionsComponent implements OnInit {
  public consumptions: Array<ConsultConsumptions>;
  public contracts: Array<Contract>;
  public contractNumberSelected: number;
  public meters: Array<Meter>;
  public meterNumberSelected: number;
  
  constructor(
    private consumptionService: ConsumptionService,
    private contractService: ContractService,
    private meterService: MeterService
    ) { }

  ngOnInit(): void {
    this.getContracts();
  }

  public getContracts() {
    this.contractService.getAll().subscribe(res => {
      this.contracts = res;
    });
  }

  public search() {
    this.consumptionService.getAllConsumptionsByContract(this.contractNumberSelected ?? null, this.meterNumberSelected ?? null).subscribe(res => {
      this.consumptions = res;
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

  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.contractNumber.toString().indexOf(term) > -1 || item.description.toLocaleLowerCase().indexOf(term) > -1;
  }

}
