import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationDetailsModalComponent } from './notification-details-modal.component';

describe('NotificationDetailsModalComponent', () => {
  let component: NotificationDetailsModalComponent;
  let fixture: ComponentFixture<NotificationDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationDetailsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
