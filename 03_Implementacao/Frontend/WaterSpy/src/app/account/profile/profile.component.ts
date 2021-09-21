import { EventService } from './../../shared/services/event.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/shared/models/user';
import { UserService } from 'src/app/shared/services/api-consumer/user.service';
import { SessionService } from 'src/app/shared/services/session.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('profileForm') profileForm: NgForm;

  public userInfo: User;
  public url: string;

  constructor(
    private sessionService: SessionService,
    private userService: UserService,
    private eventService: EventService,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    this.getUserDetails();
  }

  onSubmit() {
    this.userService.update(this.userInfo).subscribe(res => {
      this.toastr.success("Dados atualizados com sucesso");
      this.getUserDetails();
      this.eventService.changeUserInfo.next();
    });

  }

  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);

      reader.onload = () => {
        this.url = reader.result as string;
        this.userInfo.image = this.url.split("base64,")[1];
        this.userInfo.imageName = event.target.files[0].name;
        this.userInfo.imageType = event.target.files[0].type;
      }
    }
  }

  public getUserDetails(){
    const email = this.sessionService.getEmail();
    this.userService.getByUsername(email).subscribe(res => {
      this.userInfo = res;
      this.url = 'data:' + res.imageType + ';base64,' +  res.image;
    });
  }

}
