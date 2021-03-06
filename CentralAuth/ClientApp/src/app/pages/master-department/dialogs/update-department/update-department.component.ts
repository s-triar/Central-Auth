import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { DepartmentService } from 'src/app/services/department.service';
import { Subscription } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Directorate } from 'src/app/models/directorate';

import { CustomResponse } from 'src/app/models/custom-response';

import { HttpErrorResponse } from '@angular/common/http';
import { Department } from 'src/app/models/department';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DirectorateService } from 'src/app/services/directorate.service';
import { Filter } from 'src/app/models/commons/filter';
import { GridFilterType } from 'src/app/models/enums/gridfiltertype';
import { Grid } from 'src/app/models/grid';
import { GridResponse } from 'src/app/models/grid-response';

@Component({
  selector: 'app-update-department',
  templateUrl: './update-department.component.html',
  styleUrls: ['./update-department.component.scss']
})
export class UpdateDepartmentComponent implements OnInit, OnDestroy {
  filteredOptions: Directorate[];
  process = false;
  formSubscription: Subscription;
  formOptionSubscription: Subscription;
  form = this._fb.group({
    kode: [this.data.kode, [Validators.required]],
    namaDepartemen: [this.data.namaDepartemen, Validators.required],
    direktoratKode: [this.data.direktoratKode, Validators.required],
    direktorat: [this.data.direktorat?.namaDirektorat, Validators.required],
  });

  constructor(
    private _dialogRef: MatDialogRef<UpdateDepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Department,
    private _fb: FormBuilder,
    private _departmentService: DepartmentService,
    private _directorateService: DirectorateService,
  ) {
    this.form.controls['direktorat'].setValue(data.direktorat);
    this.form.controls['direktoratKode'].setValue(data.direktorat.kode);
  }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  get kode() {
    return this.form.get('kode');
  }
  get namaDepartemen() {
    return this.form.get('namaDepartemen');
  }
  get direktoratKode() {
    return this.form.get('direktoratKode');
  }
  get direktorat() {
    return this.form.get('direktorat');
  }
  onSearch(event) {
    let value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (value === undefined || value === null) {
      value = '';
    }
    const filter: Filter = {
      columnName: 'namaDirektorat',
      filterType: GridFilterType.CONTAIN,
      filterValue: value
    };
    const search: Grid = {
      filter:   [filter],
      sort: null,
      pagination: null
    };
    this.formOptionSubscription = this._directorateService.getByFilterGrid(search, true)
                                      .subscribe(
                                        (data: GridResponse<Directorate>) => {
                                          this.filteredOptions = data.data;
                                          this.formOptionSubscription.unsubscribe();
                                        },
                                        (err: HttpErrorResponse) => {
                                          this.formOptionSubscription.unsubscribe();
                                        }
                                      );

  }
  displayFn(data: Directorate) {
    return data && data.namaDirektorat ? data.namaDirektorat : '';
  }
  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const data = event.option.value as Department;
    this.form.controls['direktoratKode'].setValue(data.kode);
  }
  onNoClick(): void {
    this._dialogRef.close();
  }

  onSubmitClick() {
    if (this.form.valid) {
      this.process = true;
      const payload = new Department(this.form.value);
      delete payload.direktorat;
      this.formSubscription = this._departmentService
          .update(payload)
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
              console.log('Form Dialog Update Department Observer got a complete notification');
            }
          );
    }
  }

}
