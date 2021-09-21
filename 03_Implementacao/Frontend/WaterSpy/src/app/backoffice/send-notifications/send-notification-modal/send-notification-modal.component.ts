import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from './../../../shared/services/api-consumer/notification.service';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/shared/models/user';
import { Contract } from 'src/app/shared/models/contract';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-send-notification-modal',
  templateUrl: './send-notification-modal.component.html',
  styleUrls: ['./send-notification-modal.component.scss']
})
export class SendNotificationModalComponent implements OnInit {
  public user: User;
  public contract: Contract;
  public subject: string;
  public message: any;

  constructor(
    public activeModal: NgbActiveModal,
    private notificationService: NotificationService,    
    private toastr: ToastrService,
    private translateService: TranslateService) { }

  ngOnInit(): void {
  }

  public send() {
    this.notificationService.sendNotification(this.user, this.contract, this.subject, this.message).subscribe(
      res => {
        this.toastr.success(this.translateService.instant('GENERIC.SUCCESS_SEND_EMAIL'));
        this.activeModal.close(true);
    },
      error => {
        this.toastr.error("Ocorreu um erro inesperado");
      });
  }

}
