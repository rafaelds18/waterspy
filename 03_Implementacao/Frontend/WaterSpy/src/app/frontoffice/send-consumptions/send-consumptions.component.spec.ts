import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendConsumptionsComponent } from './send-consumptions.component';

describe('SendConsumptionsComponent', () => {
  let component: SendConsumptionsComponent;
  let fixture: ComponentFixture<SendConsumptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendConsumptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendConsumptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
