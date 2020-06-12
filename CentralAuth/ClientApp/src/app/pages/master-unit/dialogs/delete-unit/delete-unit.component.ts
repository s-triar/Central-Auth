import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { UnitService } from 'src/app/services/unit.service';
import { Subscription } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Unit } from 'src/app/models/unit';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogLoadingComponent } from 'src/app/components/dialog-loading/dialog-loading.component';
import { DialogLoadingConfig } from 'src/app/models/enums/dialog-loading-config';
import { CustomResponse } from 'src/app/models/custom-response';
import { ResponseContextGetter } from 'src/app/utils/response-context-getter';
import { SnackbarNotifComponent } from 'src/app/components/snackbar-notif/snackbar-notif.component';
import { SnackbarNotifConfig } from 'src/app/models/enums/snackbar-config';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-delete-unit',
  templateUrl: './delete-unit.component.html',
  styleUrls: ['./delete-unit.component.scss']
})
export class DeleteUnitComponent implements OnInit, OnDestroy {

  process = false;
  formSubscription: Subscription;
  form = this._fb.group({
    kode: [this.data.kode, [Validators.required]],
    namaUnit: [this.data.namaUnit, Validators.required],
  });
  constructor(
    private _dialog: MatDialog,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<DeleteUnitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Unit,
    private _unitService: UnitService,
    private _snackbar: MatSnackBar
  ) { }

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
  }
  get kode() {
    return this.form.get('kode');
  }
  get namaUnit() {
    return this.form.get('namaUnit');
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
      this.formSubscription = this._unitService
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
              console.log('Form Dialog Delete Unit Observer got a complete notification');
            }
          );
    }
  }
}
