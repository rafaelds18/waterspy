import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';
import { Supplier } from 'src/app/shared/models/supplier';
import { SupplierService } from 'src/app/shared/services/api-consumer/supplier.service';

@Component({
  selector: 'app-manage-suppliers',
  templateUrl: './manage-suppliers.component.html',
  styleUrls: ['./manage-suppliers.component.scss']
})
export class ManageSuppliersComponent implements OnInit {
  public suppliersList: Array<Supplier>;
  public suppliersForm: FormGroup;

  constructor(
    private supplierService: SupplierService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private translateService: TranslateService) { }

  ngOnInit(): void {
    this.suppliersForm = this.fb.group({
      suppliers: this.fb.array([])
    });
    this.getSuppliers();
  }

  get suppliers() {
    return this.suppliersForm.controls["suppliers"] as FormArray;
  }

  public getSuppliers(){
    this.supplierService.getAll().subscribe(res => {
      this.suppliersList = res;
      for (let supplier of this.suppliersList) {
        this.suppliers.push(
          this.setFormGroup(supplier.name, supplier.tin, false, supplier.id)
        );
      }
    })
  }

  public initiateForm(): FormGroup {
    return this.setFormGroup('', '', true);
  }

  public setFormGroup(name: string, tin: any, isEditable: boolean, id?: number){
    return new FormGroup({
      id: new FormControl(id),
      name: new FormControl(name, Validators.required),
      tin: new FormControl(tin, Validators.required),
      isEditable: new FormControl(isEditable)
    });
  }

  public addRow() {
    this.suppliers.push(this.initiateForm());
  }

  public editRow(group: any) {
    group.controls['isEditable'].setValue(true);
  }

  public doneRow(group: any) {
    let supplier: Supplier = {
      name: group.controls['name'].value,
      tin: group.controls['tin'].value,
      deleted: false
    };

    const existSupplier = this.suppliersList.find(x => x.id == group.controls['id'].value);
    if (existSupplier) {
      supplier.id = existSupplier.id;
      this.supplierService.update(supplier).subscribe(res => {
        this.toastr.success("Fornecedor atualizado com sucesso");
      });
    }
    else {
      this.supplierService.add(supplier).subscribe(res => {
        const supplierAdded: Supplier = {
          id: res.supplier.Id,
          name: res.supplier.name,
          tin: res.supplier.tin,
          deleted: res.supplier.deleted
        };
        group.controls['id'].setValue(supplierAdded.id);
        this.suppliersList.push(supplierAdded);
        this.toastr.success("Fornecedor criado com sucesso");
      });
    }
    
    group.controls['isEditable'].setValue(false);
  }

  public cancelRow(group: any, index: number) {
    const supplier = this.suppliersList.find(x => x.id == group.controls['id'].value);
    if (supplier) {
      group.controls['name'].setValue(supplier?.name);
      group.controls['tin'].setValue(supplier?.tin);
      group.controls['isEditable'].setValue(false);
    }
    else {
      this.suppliers.removeAt(index);
    }
  }

  public remove(group: any, index: number) {
    let supplier: Supplier = {
      id: group.controls['id'].value,
      name: group.controls['name'].value,
      tin: group.controls['tin'].value,
      deleted: true
    };
    this.supplierService.update(supplier).subscribe(res => {
      this.toastr.success("Fornecedor removido com sucesso");
      this.suppliers.removeAt(index);
    });
  }

  public deleteConfirmation(group: any, index: number) {
    const modalDetails = this.modalService.open(DeleteConfirmationComponent, { size: 'lg' });
    modalDetails.componentInstance.textDescription = this.translateService.instant('GENERIC.CONFIRM_DELETE_SUPPLIER');

    modalDetails.result.then((result) => {
      if (result) {
        this.remove(group, index);
      }
    });
  }
}
