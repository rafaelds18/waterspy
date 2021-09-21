import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultConsumptionsComponent } from './consult-consumptions.component';

describe('ConsultConsumptionsComponent', () => {
  let component: ConsultConsumptionsComponent;
  let fixture: ComponentFixture<ConsultConsumptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultConsumptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultConsumptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
