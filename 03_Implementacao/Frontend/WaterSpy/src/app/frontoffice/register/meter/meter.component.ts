import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Meter } from 'src/app/shared/models/meter';
import { MetersComponent } from 'src/app/shared/components/meters/meters.component';
import { SupplierService } from 'src/app/shared/services/api-consumer/supplier.service';
import { ContractService } from 'src/app/shared/services/api-consumer/contract.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MeterService } from 'src/app/shared/services/api-consumer/meter.service';
import { Supplier } from 'src/app/shared/models/supplier';
import { Contract } from 'src/app/shared/models/contract';

@Component({
  selector: 'app-meter',
  templateUrl: './meter.component.html',
  styleUrls: ['./meter.component.scss']
})
export class MeterComponent implements OnInit {
  @ViewChild('metersForm') metersForm: NgForm;

  public contractNumber: number;
  public contractId: number;
  public contract: Contract;

  public contracts: Contract[];
  public suppliers: Supplier[];
  public alerts: string[];
  public meters: Array<Meter>;
  
  public metersComp: MetersComponent;

  constructor(
    private supplierService: SupplierService,
    private contractService: ContractService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private meterService: MeterService) {
     }

  ngOnInit(): void {
    this.contractId = 0;
    this.contractService.getAll().subscribe(res => {
      this.contracts = res;
    });
  }

  public onSubmit() {
    if (this.metersForm.form.valid && this.contractNumber) {
      this.contracts.forEach(contract => {
        if(contract.id == this.contractId){
          this.contractNumber = contract.contractNumber;
        }
      });
      
      this.meterService.add(this.contractNumber, this.contract.supplierId, this.meters).subscribe(
        res => {
          if (res) {
            this.toastr.success("Contadores adicionados criados com sucesso!!");
            this.metersForm.form.reset();
            this.metersComp.reset();
          }
        },
        error => {
          this.alerts = [];
          if (error.error && error.error.code) {
            this.alerts.push(this.translate.instant('ERROR_CODES.' + error.error.code));
          }
        });

    } else {
      this.metersForm.form.markAllAsTouched();
      this.metersComp.markAllAsTouched();
    }
  }

  setMeters(meters: Array<Meter>){
    this.meters = meters;
  }

}
