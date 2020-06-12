import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Department } from 'src/app/models/department';
import { Subscription } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogLoadingComponent } from 'src/app/components/dialog-loading/dialog-loading.component';
import { DialogLoadingConfig } from 'src/app/models/enums/dialog-loading-config';
import { CustomResponse } from 'src/app/models/custom-response';
import { ResponseContextGetter } from 'src/app/utils/response-context-getter';
import { SnackbarNotifComponent } from 'src/app/components/snackbar-notif/snackbar-notif.component';
import { SnackbarNotifConfig } from 'src/app/models/enums/snackbar-config';
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
    private _dialog: MatDialog,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<DeleteDepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Department,
    private _departmentService: DepartmentService,
    private _snackbar: MatSnackBar
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
      const dialogLoading = this._dialog.open(DialogLoadingComponent, {
        minWidth: DialogLoadingConfig.MIN_WIDTH,
        disableClose: DialogLoadingConfig.DISABLED_CLOSE
      });
      this.formSubscription = this._departmentService
          .delete(this.form.value['kode'])
          .subscribe(
            (x: CustomResponse<any>) => {
              const context = ResponseContextGetter.GetCustomResponseContext<any>(x);
              this._snackbar.openFromComponent(SnackbarNotifComponent, {
                duration: SnackbarNotifConfig.DURATION,
                data: context,
                horizontalPosition: <any>SnackbarNotifConfig.HORIZONTAL_POSITION,
                verticalPosition: <any>SnackbarNotifConfig.VERTICAL_POSITION
              });
              this.formSubscription.unsubscribe();
              dialogLoading.close();
              this._dialogRef.close(true);
            },
            (err: HttpErrorResponse) => {
              const context = ResponseContextGetter.GetErrorContext<any>(err);
                this._snackbar.openFromComponent(SnackbarNotifComponent, {
                duration: SnackbarNotifConfig.DURATION,
                data: context,
                horizontalPosition: <any>SnackbarNotifConfig.HORIZONTAL_POSITION,
                verticalPosition: <any>SnackbarNotifConfig.VERTICAL_POSITION
              });
              this.formSubscription.unsubscribe();
              dialogLoading.close();
            },
            () => {
              console.log('Form Dialog Delete Department Observer got a complete notification');
            }
          );
    }
  }

}
