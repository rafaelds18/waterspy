import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/shared/services/api-consumer/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  public alerts: Array<string>;
  public defaultImage: string;
  public defaultImageName: string;
  public defaultImageType: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private httpClient: HttpClient
    ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['',[Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['',[Validators.required]],
      repeatPassword: ['',[Validators.required]]
    });
   }

  ngOnInit(): void {
    this.alerts = [];
    
    this.httpClient.get('/assets/img/user_profile.png', { responseType: 'blob' })
      .subscribe(res => {
        const reader = new FileReader();
        reader.onloadend = () => {
          var base64data = reader.result as string;   
          this.defaultImage = base64data.split("base64,")[1];
        }
        this.defaultImageType = res.type;
        this.defaultImageName = 'user_default.png';
        reader.readAsDataURL(res); 
      });
  }

  public onSubmit() {
    var image = new Image();
      image.src = 'src/assets/img/user_profile.png';

    if (this.registerForm.valid && this.validatePassword()) {
      

      const user = {
        email: this.registerForm.controls.email.value,
        firstName: this.registerForm.controls.firstName.value,
        lastName: this.registerForm.controls.lastName.value,
        password: this.registerForm.controls.password.value,
        imageName: this.defaultImageName,
        image: this.defaultImage,
        imageType: this.defaultImageType,
        createdBy: 'System', 
        updatedBy: 'System',
        version: 1
      };
      this.authenticationService.register(user).subscribe( 
        res => {
          if (res) {
            this.router.navigateByUrl("/login");
          }
        },
        error => {
          this.alerts = [];
          if (error.error && error.error.code) {
            this.alerts.push(this.translate.instant('ERROR_CODES.' + error.error.code));
          }
        }
      )

    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  public validatePassword() {
    return this.registerForm.controls.password.value === this.registerForm.controls.repeatPassword.value;
  }

  public back(): void {
    this.router.navigateByUrl('/login');
  }

}
