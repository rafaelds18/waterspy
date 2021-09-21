import { NotificationDetailsModalComponent } from './../notification-details-modal/notification-details-modal.component';
import { Component, OnInit } from '@angular/core';
import { Notification } from 'src/app/shared/models/notification';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/shared/services/api-consumer/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  public notifications: Array<Notification>;
  
  constructor(
    private notificationService: NotificationService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getNotifications();
  }

  public getNotifications(){
    this.notificationService.getNotifications().subscribe(res=>{
      this.notifications = res;
    });
  }

  public showDetails(notification: Notification){
    const modalDetails = this.modalService.open(NotificationDetailsModalComponent, { size: 'lg' });
    modalDetails.componentInstance.notification = notification;
  }
}
