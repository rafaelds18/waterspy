import { Notification } from './../../../shared/models/notification';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-notification-details-modal',
  templateUrl: './notification-details-modal.component.html',
  styleUrls: ['./notification-details-modal.component.scss']
})
export class NotificationDetailsModalComponent implements OnInit {
  public notification: Notification;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
