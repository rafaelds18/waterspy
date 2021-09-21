import { EventService } from './../../services/event.service';
import { MenuItem } from '../../models/menu-item';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/api-consumer/user.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public menuItems: MenuItem[];
  public username: string;
  public url: string;
  public isAdmin: boolean;

  constructor(
    private translateService: TranslateService,
    private sessionService: SessionService,
    private userService: UserService,
    private eventService: EventService) {

      this.eventService.changeUserInfo.subscribe(() => {
        this.getUserDetails();
      });

      this.isAdmin = this.sessionService.isAdmin();
    }

  ngOnInit(): void {
    this.getUserDetails();
    if (this.isAdmin) {
      this.setItemsAdmin();
    }
    else {
      this.setItemsConsumer();
    }
    
  }

  public setItemsConsumer() {
    this.menuItems = [
      {
        icon: 'bi bi-house-fill',
        link: '/home'
      },
      {
        description: this.translateService.instant('MENU.PROFILE'),
        link: '/account/profile'
      },
      {
        description: this.translateService.instant('MENU.REGISTER'),
        link: '',
        subItems: [{
          description: this.translateService.instant('MENU.CONTRACTS'),
          link: '/register/contracts'
        },
      ]
      },
      {
        description: this.translateService.instant('MENU.CONSULT'),
        link: '',
        subItems: [{
          description: this.translateService.instant('MENU.CONSUMPTIONS'),
          link: '/consult/consumptions'
        },
        {
          description: this.translateService.instant('MENU.CONTRACTS'),
          link: '/consult/contracts'
        }]
      },  
      {
        description: this.translateService.instant('MENU.SEND_CONSUMPTIONS'),
        link: '/sendConsumptions'
      }, 
      {
        description: this.translateService.instant('MENU.NOTIFICATIONS'),
        link: '/notifications'
      }
    ]
  }

  public setItemsAdmin() {
    this.menuItems = [
      {
        description: this.translateService.instant('MENU.PROFILE'),
        link: '/account/profile'
      },
      {
        description: this.translateService.instant('MENU.CONSULT'),
        link: '',
        subItems: [{
          description: this.translateService.instant('MENU.CONSUMPTIONS'),
          link: '/backoffice/consult-consumptions'
        }]
      },
      {
        description: this.translateService.instant('MENU.SEND_NOTIFICATIONS'),
        link: '/backoffice/send-notifications'
      },
      {
        description: this.translateService.instant('MENU.USERS'),
        link: '/backoffice/manage-users'
      },
      {
        description: this.translateService.instant('MENU.SUPPLIERS'),
        link: '/backoffice/suppliers'
      }
    ]
  }

  public getUserDetails(){
    const email = this.sessionService.getEmail();
    this.userService.getByUsername(email).subscribe(res => {
      this.username = res.firstName + ' ' + res.lastName;
      this.url = 'data:' + res.imageType + ';base64,' +  res.image;
    });
  }

}
