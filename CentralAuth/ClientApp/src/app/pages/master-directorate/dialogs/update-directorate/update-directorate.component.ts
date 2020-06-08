import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Directorate } from 'src/app/models/directorate';
import { DirectorateService } from 'src/app/services/directorate.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogLoadingComponent } from 'src/app/components/dialog-loading/dialog-loading.component';
import { DialogLoadingConfig } from 'src/app/models/enums/dialog-loading-config';
import { CustomResponse } from 'src/app/models/custom-response';
import { ResponseContextGetter } from 'src/app/utils/response-context-getter';
import { SnackbarNotifComponent } from 'src/app/components/snackbar-notif/snackbar-notif.component';
import { SnackbarNotifConfig } from 'src/app/models/enums/snackbar-config';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-update-directorate',
  templateUrl: './update-directorate.component.html',
  styleUrls: ['./update-directorate.component.scss']
})
export class UpdateDirectorateComponent implements OnInit, OnDestroy {

  process = false;
  formSubscription: Subscription;
  form = this._fb.group({
    Kode: [this.data.kode, [Validators.required]],
    NamaDirektorat: [this.data.namaDirektorat, Validators.required],
  });

  constructor(
    private _dialog: MatDialog,
    private _dialogRef: MatDialogRef<UpdateDirectorateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Directorate,
    private _fb: FormBuilder,
    private _directorateService: DirectorateService,
    private _snackbar: MatSnackBar
  ) {

  }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  get Kode() {
    return this.form.get('Kode');
  }
  get NamaDirektorat() {
    return this.form.get('NamaDirektorat');
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
      this.formSubscription = this._directorateService
          .update(new Directorate(this.form.value))
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
              console.log('Form Dialog Create Directorate Observer got a complete notification');
            }
          );
    }
  }

}
