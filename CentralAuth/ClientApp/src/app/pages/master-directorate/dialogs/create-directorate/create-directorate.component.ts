import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Directorate } from 'src/app/models/directorate';
import { DialogLoadingComponent } from 'src/app/components/dialog-loading/dialog-loading.component';
import { DirectorateService } from 'src/app/services/directorate.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseContextGetter } from 'src/app/utils/response-context-getter';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarNotifComponent } from 'src/app/components/snackbar-notif/snackbar-notif.component';
import { CustomResponse } from 'src/app/models/custom-response';
import { SnackbarNotifConfig } from 'src/app/models/enums/snackbar-config';
import { DialogLoadingConfig } from 'src/app/models/enums/dialog-loading-config';
@Component({
  selector: 'app-create-directorate',
  templateUrl: './create-directorate.component.html',
  styleUrls: ['./create-directorate.component.scss']
})
export class CreateDirectorateComponent implements OnInit {

  process = false;

  CreateForm = this._fb.group({
    Kode: [this.data.kode, [Validators.required]],
    NamaDirektorat: [this.data.namaDirektorat, Validators.required],
  });

  constructor(
    private _dialog: MatDialog,
    private _dialogRef: MatDialogRef<CreateDirectorateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Directorate,
    private _fb: FormBuilder,
    private _directorateService: DirectorateService,
    private _snackbar: MatSnackBar
  ) {

  }

  ngOnInit(): void {
  }

  get Kode() {
    return this.CreateForm.get('Kode');
  }
  get NamaDirektorat() {
    return this.CreateForm.get('NamaDirektorat');
  }

  onNoClick(): void {
    this._dialogRef.close();
  }

  onSubmitClick() {
    if (this.CreateForm.valid) {
      this.process = true;
      const dialogLoading = this._dialog.open(DialogLoadingComponent, {
        minWidth: DialogLoadingConfig.MIN_WIDTH,
        disableClose: DialogLoadingConfig.DISABLED_CLOSE
      });
      const re: number = SnackbarNotifConfig.DURATION;
      console.log(re);
      const r: string = SnackbarNotifConfig.VERTICAL_POSITION;
      console.log(r);

      this._directorateService
          .create(new Directorate(this.CreateForm.value))
          .toPromise()
          .then((res: CustomResponse<any>) => {
            const context = ResponseContextGetter.GetCustomResponseContext<any>(res);
            this._snackbar.openFromComponent(SnackbarNotifComponent, {
              duration: SnackbarNotifConfig.DURATION,
              data: context,
              horizontalPosition: <any>SnackbarNotifConfig.HORIZONTAL_POSITION,
              verticalPosition: <any>SnackbarNotifConfig.VERTICAL_POSITION
            });
            dialogLoading.close();
            this._dialogRef.close(true);
          })
          .catch((err: HttpErrorResponse) => {
            const context = ResponseContextGetter.GetErrorContext<any>(err);
            this._snackbar.openFromComponent(SnackbarNotifComponent, {
              duration: SnackbarNotifConfig.DURATION,
              data: context,
              horizontalPosition: <any>SnackbarNotifConfig.HORIZONTAL_POSITION,
              verticalPosition: <any>SnackbarNotifConfig.VERTICAL_POSITION
            });
            dialogLoading.close();
          });
    }
  }



}
