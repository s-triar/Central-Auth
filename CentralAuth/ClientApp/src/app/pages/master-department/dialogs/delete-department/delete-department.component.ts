import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Department } from 'src/app/models/department';
import { Subscription } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomResponse } from 'src/app/models/custom-response';
import { HttpErrorResponse } from '@angular/common/http';
import { DepartmentService } from 'src/app/services/department.service';

@Component({
  selector: 'app-delete-department',
  templateUrl: './delete-department.component.html',
  styleUrls: ['./delete-department.component.scss']
})
export class DeleteDepartmentComponent implements OnInit, OnDestroy {

  process = false;
  formSubscription: Subscription;
  form = this._fb.group({
    kode: [this.data.kode, [Validators.required]],
    namaDepartemen: [this.data.namaDepartemen, Validators.required],
  });
  constructor(
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<DeleteDepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Department,
    private _departmentService: DepartmentService,
  ) { }

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
  onNoClick(): void {
    this._dialogRef.close();
  }

  onSubmitClick() {
    if (this.form.valid) {
      this.process = true;
      this.formSubscription = this._departmentService
          .delete(this.form.value['kode'])
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
              console.log('Form Dialog Delete Department Observer got a complete notification');
            }
          );
    }
  }

}
