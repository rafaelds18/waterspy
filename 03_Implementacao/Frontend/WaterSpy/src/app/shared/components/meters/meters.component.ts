import { TranslateService } from '@ngx-translate/core';
import { Meter } from './../../models/meter';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-meters',
  templateUrl: './meters.component.html',
  styleUrls: ['./meters.component.scss']
})
export class MetersComponent implements OnInit {
  @Input() metersReceived: Array<Meter>;
  @Input() showButtons: boolean;
  @Output() metersChanged = new EventEmitter();

  public metersForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.metersForm = this.fb.group({
      meters: this.fb.array([])
    });

    this.showButtons

    if (this.metersReceived) {
      this.setMeters();
    }
  }

  get meters() {
    return this.metersForm.controls["meters"] as FormArray;
  }

  setMeters() {
    for (let meterReceived of this.metersReceived) {
      this.meters.push(
        new FormGroup({
          meterNumber: new FormControl(meterReceived.meterNumber, Validators.required),
          valInitMeter: new FormControl(meterReceived.valInitMeter, Validators.required)
        })
      );
    }
  }

  addMeter() {
    const meterForm = this.fb.group({
      meterNumber: ['', Validators.required],
      valInitMeter:['',Validators.required]
    });
    this.meters.push(meterForm);
    this.metersChanged.emit(this.meters.value);
  }

  deleteMeter(meterIndex: number) {
    if (this.metersReceived) {
      this.deleteConfirmation(meterIndex);
    }
    else {
      this.removeMeter(meterIndex);
    }
  }

  public removeMeter(meterIndex: number) {
    this.meters.removeAt(meterIndex);
    this.metersChanged.emit(this.meters.value);
  }

  changeMeter() {
    this.metersChanged.emit(this.meters.value);
  }

  reset() {
    this.metersForm.reset();
    this.meters.clear();
  }

  markAllAsTouched() {
    this.metersForm.markAllAsTouched();
  }

  public deleteConfirmation(meterIndex: number) {
    const modalDetails = this.modalService.open(DeleteConfirmationComponent, { size: 'lg' });
    modalDetails.componentInstance.textDescription = this.translateService.instant('GENERIC.CONFIRM_DELETE_METER');
    modalDetails.result.then((result) => {
      if (result) {
        this.removeMeter(meterIndex);
      }
    });
  }
}


