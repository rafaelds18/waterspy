import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/shared/services/api-consumer/authentication.service';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss']
})
export class EmailConfirmationComponent implements OnInit {
  public alerts: string[];
  public successAlert: boolean;
  public token: any;

  constructor(
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');
    });

    this.confirmEmail();
  }

  public confirmEmail() {
    this.authenticationService.confirmEmail(this.token).subscribe(
      (res) => {
        this.successAlert = this.translateService.instant('EMAIL_CONFIRM.SUCCESS');
      },
      (error) => {
        this.toastr.error("Ocorreu um erro inesperado");
      }
    )
  }

}
