import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Contract } from 'src/app/shared/models/contract';
import { User } from 'src/app/shared/models/user';
import { ContractService } from 'src/app/shared/services/api-consumer/contract.service';
import { SendNotificationModalComponent } from './send-notification-modal/send-notification-modal.component';

@Component({
  selector: 'app-send-notifications',
  templateUrl: './send-notifications.component.html',
  styleUrls: ['./send-notifications.component.scss']
})
export class SendNotificationsComponent implements OnInit {
  public contracts: Array<Contract>;
  public contractNumberSelected: number;
  public users: Array<User> = new Array<User>();
  
  constructor(
    private contractService: ContractService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getContracts();
  }

  public getContracts() {
    this.contractService.getAll().subscribe(res => {
      this.contracts = res;
    });
  }

  public search() {
    let users = this.contracts.find(x => x.contractNumber == this.contractNumberSelected)?.users;
    if (users) {
      this.users = users;
    }
  }

  public openModal(user: User){
    const modalDetails = this.modalService.open(SendNotificationModalComponent, { size: 'lg' });
    modalDetails.componentInstance.user = user;
    modalDetails.componentInstance.contract = this.contracts.find(x => x.contractNumber == this.contractNumberSelected);
  }

  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.contractNumber.toString().indexOf(term) > -1 || item.description.toLocaleLowerCase().indexOf(term) > -1;
  }

}
