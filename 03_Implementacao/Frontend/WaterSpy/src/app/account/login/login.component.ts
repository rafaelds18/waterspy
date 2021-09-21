import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/shared/services/api-consumer/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from 'src/app/shared/services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  username: string;
  password: string;
  isUsernameValid: boolean;

  public users: Array<User>;
  public alerts: Array<string>;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private translate: TranslateService,
    private sessionService: SessionService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.sessionService.clearSession();
  }

  public onSubmit() {
    const user = {
      email: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value,
    };
    this.authenticationService.login(user).subscribe(
      res => {
        this.sessionService.storeSession(res);
        if (this.sessionService.isAdmin()) {
          this.router.navigateByUrl('/backoffice');
        }
        else {
          this.router.navigateByUrl('/home');
        }
      },
      error => {
        this.alerts = [];
        if (error.error && error.error.code) {
          this.alerts.push(this.translate.instant('ERROR_CODES.' + error.error.code));
        }
      }
    );
  }
}
