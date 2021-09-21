import { LoadingService } from './shared/services/loading.service';
import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import { SessionService } from 'src/app/shared/services/session.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewChecked{
  public isAuthenticated: boolean;
  public loading$: Observable<boolean>;

  title = 'WaterSpy';
  
  constructor(
    private sessionService: SessionService,
    private cdRef: ChangeDetectorRef,
    private loader: LoadingService
    ) {
    this.loading$ = this.loader.loading$;
    this.isAuthenticated = this.sessionService.isAuthenticated();
  }

  ngAfterViewChecked(): void {
    const isAuthenticated = this.sessionService.isAuthenticated();
    if (isAuthenticated != this.isAuthenticated) {
      this.isAuthenticated = isAuthenticated;
      this.cdRef.detectChanges();
    }
  }
}
