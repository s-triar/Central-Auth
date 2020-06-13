import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubDepartment } from 'src/app/models/sub-department';
import { SubDepartmentService } from 'src/app/services/sub-department.service';
import { CustomResponse } from 'src/app/models/custom-response';
import { HttpErrorResponse } from '@angular/common/http';
import { Grid } from 'src/app/models/grid';
import { Department } from 'src/app/models/department';
import { Filter } from 'src/app/models/commons/filter';
import { GridFilterType } from 'src/app/models/enums/gridfiltertype';
import { DepartmentService } from 'src/app/services/department.service';
import { GridResponse } from 'src/app/models/grid-response';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-create-sub-department',
  templateUrl: './create-sub-department.component.html',
  styleUrls: ['./create-sub-department.component.scss']
})
export class CreateSubDepartmentComponent implements OnInit, OnDestroy {

  filteredOptions: Department[];
  process = false;
  formSubscription: Subscription;
  formOptionSubscription: Subscription;
  form = this._fb.group({
    kode: [this.data.kode, [Validators.required]],
    namaSubDepartemen: [this.data.namaSubDepartemen, Validators.required],
    departemenKode: [this.data.departemenKode, Validators.required],
    departemen: [this.data.departemen?.namaDepartemen, Validators.required],
  });

  constructor(
    private _dialogRef: MatDialogRef<CreateSubDepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SubDepartment,
    private _fb: FormBuilder,
    private _subDepartmentService: SubDepartmentService,
    private _departemenService: DepartmentService,
  ) {

  }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  get kode() {
    return this.form.get('kode');
  }
  get namaSubDepartemen() {
    return this.form.get('namaSubDepartemen');
  }
  get departemenKode() {
    return this.form.get('departemenKode');
  }
  get departemen() {
    return this.form.get('departemen');
  }

  onSearch(event) {
    let value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (value === undefined || value === null) {
      value = '';
    }
    const filter: Filter = {
      columnName: 'namaDepartemen',
      filterType: GridFilterType.CONTAIN,
      filterValue: value
    };
    const search: Grid = {
      filter:   [filter],
      sort: null,
      pagination: null
    };
    this.formOptionSubscription = this._departemenService.getByFilterGrid(search, true)
                                      .subscribe(
                                        (data: GridResponse<Department>) => {
                                          this.filteredOptions = data.data;
                                          this.formOptionSubscription.unsubscribe();
                                        },
                                        (err: HttpErrorResponse) => {
                                          this.formOptionSubscription.unsubscribe();
                                        }
                                      );

  }
  displayFn(data: Department) {
    return data && data.namaDepartemen ? data.namaDepartemen : '';
  }
  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const data = event.option.value as Department;
    this.form.controls['departemenKode'].setValue(data.kode);
  }
  onNoClick(): void {
    this._dialogRef.close();
  }

  onSubmitClick() {
    if (this.form.valid) {
      this.process = true;
      const payload = new SubDepartment(this.form.value);
      delete payload.departemen;
      this.formSubscription = this._subDepartmentService
          .create(payload)
          .subscribe(
            (x: CustomResponse<any>) => {
              this.formSubscription.unsubscribe();
              this._dialogRef.close(true);
            },
            (err: HttpErrorResponse) => {
              this.formSubscription.unsubscribe();
              this.process = false;
            },
            () => {
              console.log('Form Dialog Create Sub Department Observer got a complete notification');
            }
          );
    }
  }

}
