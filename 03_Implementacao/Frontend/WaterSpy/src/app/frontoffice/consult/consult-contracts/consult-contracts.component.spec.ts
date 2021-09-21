import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultContractsComponent } from './consult-contracts.component';

describe('ConsultContractsComponent', () => {
  let component: ConsultContractsComponent;
  let fixture: ComponentFixture<ConsultContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultContractsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
