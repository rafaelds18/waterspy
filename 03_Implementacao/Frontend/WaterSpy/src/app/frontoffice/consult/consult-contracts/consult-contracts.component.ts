import { ContractService } from 'src/app/shared/services/api-consumer/contract.service';
import { Component, OnInit } from '@angular/core';
import { Contract } from 'src/app/shared/models/contract';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContractDetailsModalComponent } from './contract-details-modal/contract-details-modal.component';

@Component({
  selector: 'app-consult-contracts',
  templateUrl: './consult-contracts.component.html',
  styleUrls: ['./consult-contracts.component.scss']
})
export class ConsultContractsComponent implements OnInit {
  public contracts: Array<Contract>;

  constructor(
    private contractService: ContractService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getContracts();
  }

  public getContracts() {
    this.contractService.getDetailsByUser().subscribe(res => {
      this.contracts = res;
    });
  }

  public showDetails(contract: Contract) {
    const modalDetails = this.modalService.open(ContractDetailsModalComponent, { size: 'lg' });
    modalDetails.componentInstance.contractId = contract.id;
    modalDetails.componentInstance.contractNumber = contract.contractNumber;
    modalDetails.componentInstance.supplierId = contract.supplierId;
  }

}
