import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { SubDepartment } from 'src/app/models/sub-department';
import { Subscription } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubDepartmentService } from 'src/app/services/sub-department.service';
import { CustomResponse } from 'src/app/models/custom-response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-delete-sub-department',
  templateUrl: './delete-sub-department.component.html',
  styleUrls: ['./delete-sub-department.component.scss']
})
export class DeleteSubDepartmentComponent implements OnInit, OnDestroy {

  process = false;
  formSubscription: Subscription;
  form = this._fb.group({
    kode: [this.data.kode, [Validators.required]],
    namaSubDepartemen: [this.data.namaSubDepartemen, Validators.required],
    departemen: [this.data.departemen.namaDepartemen, Validators.required],
  });
  constructor(
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<DeleteSubDepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SubDepartment,
    private _subDepartmentService: SubDepartmentService,
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
  get departemen() {
    return this.form.get('departemen');
  }
  onNoClick(): void {
    this._dialogRef.close();
  }

  onSubmitClick() {
    if (this.form.valid) {
      this.process = true;
      this.formSubscription = this._subDepartmentService
          .delete(new SubDepartment(this.form.value))
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
              console.log('Form Dialog Delete Sub Department Observer got a complete notification');
            }
          );
    }
  }

}
