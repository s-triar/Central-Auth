import { Component, OnInit, Inject } from '@angular/core';
import { BranchService } from 'src/app/services/branch.service';
import { Branch } from 'src/app/models/branch';
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

@Component({
  selector: 'app-update-branch',
  templateUrl: './update-branch.component.html',
  styleUrls: ['./update-branch.component.scss']
})
export class UpdateBranchComponent implements OnInit {

  process = false;
  formSubscription: Subscription;
  form = this._fb.group({
    kode: [this.data.kode, [Validators.required]],
    namaCabang: [this.data.namaCabang, Validators.required],
    singkatan: [this.data.singkatan, Validators.required],
    alamat: [this.data.alamat, Validators.required],
    keterangan: [this.data.keterangan],
  });

  constructor(
    private _dialog: MatDialog,
    private _dialogRef: MatDialogRef<UpdateBranchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Branch,
    private _fb: FormBuilder,
    private _branchService: BranchService,
    private _snackbar: MatSnackBar
  ) {

  }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  get kode() {
    return this.form.get('kode');
  }
  get namaCabang() {
    return this.form.get('namaCabang');
  }
  get singkatan() {
    return this.form.get('singkatan');
  }
  get alamat() {
    return this.form.get('alamat');
  }
  get keterangan() {
    return this.form.get('keterangan');
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
      this.formSubscription = this._branchService
          .update(new Branch(this.form.value))
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
              console.log('Form Dialog Update Department Observer got a complete notification');
            }
          );
    }
  }

}
