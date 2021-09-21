import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertsComponent } from './components/alerts/alerts.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { MetersComponent } from './components/meters/meters.component';
import { DeleteConfirmationComponent } from './components/delete-confirmation/delete-confirmation.component';

@NgModule({
  declarations: [
    AlertsComponent,
    NavbarComponent,
    LoadingSpinnerComponent,
    MetersComponent,
    DeleteConfirmationComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    RouterModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    AlertsComponent,
    NavbarComponent,
    LoadingSpinnerComponent,
    MetersComponent,
    DeleteConfirmationComponent,
    NgSelectModule
  ]
})
export class SharedModule { }
