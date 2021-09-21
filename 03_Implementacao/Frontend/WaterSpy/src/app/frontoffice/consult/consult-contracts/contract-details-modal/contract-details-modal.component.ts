import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Meter } from 'src/app/shared/models/meter';
import { MeterService } from 'src/app/shared/services/api-consumer/meter.service';

@Component({
  selector: 'app-contract-details-modal',
  templateUrl: './contract-details-modal.component.html',
  styleUrls: ['./contract-details-modal.component.scss']
})
export class ContractDetailsModalComponent implements OnInit {
  public contractId: number;
  public contractNumber: number;
  public supplierId: number;
  public metersList: Array<Meter>;
  public isEdit = false;
  public showButtons = false;

  constructor(
    public activeModal: NgbActiveModal,
    private meterService: MeterService,
    private toastr: ToastrService,
    private translateService: TranslateService) { }

  ngOnInit(): void {
    this.setMeters();
  }

  setMeters(meters?: Array<Meter>){
    if (meters) {
      this.metersList = meters;
    }
    else {
      this.meterService.getByContract(this.contractId).subscribe(res => {
        this.metersList = res;
      });
    }
  }

  edit() {
    this.showButtons = true
    this.isEdit = true;
  }

  save() {
    this.meterService.add(this.contractNumber, this.supplierId, this.metersList).subscribe(
      res => {
        this.toastr.success(this.translateService.instant('GENERIC.CHANGES_SUCCESS'));
        this.activeModal.close();
      }
    )
  }

}
