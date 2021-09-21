import { SessionService } from 'src/app/shared/services/session.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Meter } from 'src/app/shared/models/meter';
import { Supplier } from 'src/app/shared/models/supplier';
import { ContractService } from 'src/app/shared/services/api-consumer/contract.service';
import { SupplierService } from 'src/app/shared/services/api-consumer/supplier.service';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})
export class ContractsComponent implements OnInit {
  @ViewChild('contractsForm') contractsForm: NgForm;
  @ViewChild('meters') metersComp: any;
  
  public contractNumber: number;
  public description: string;
  public supplierId: number;
  public supplier: Supplier;

  public suppliers: Supplier[];
  public alerts: string[];
  public meters: Array<Meter>;

  constructor(
    private supplierService: SupplierService,
    private contractService: ContractService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
    this.supplierId = 0;
    this.supplierService.getAll().subscribe(res => {
      this.suppliers = res;
    });
  }

  public onSubmit() {
    if (this.contractsForm.form.valid) {
      const contract = {
        description: this.description,
        contractNumber: this.contractNumber,
        supplierId: this.supplierId
      };
     
      const email = this.sessionService.getEmail();
      this.contractService.add(email, contract, this.meters).subscribe(
        res => {
          if (res) {
            this.toastr.success("Contrato criado com sucesso");
            this.contractsForm.form.reset();
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
      this.contractsForm.form.markAllAsTouched();
      this.metersComp.markAllAsTouched();
    }
  }

  setMeters(meters: Array<Meter>){
    this.meters = meters;
  }

}
