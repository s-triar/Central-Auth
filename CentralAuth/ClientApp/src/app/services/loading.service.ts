import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogLoadingComponent } from '../components/dialog-loading/dialog-loading.component';
import { DialogLoadingConfig } from '../models/enums/dialog-loading-config';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  dialogLoading: MatDialogRef<DialogLoadingComponent>;
  counterLoading = 0;
  constructor(
    private _dialog: MatDialog,
  ) { }

  showLoading() {
    if (this.counterLoading === 0) {
      this.dialogLoading = this._dialog.open(DialogLoadingComponent, {
        minWidth: DialogLoadingConfig.MIN_WIDTH,
        disableClose: DialogLoadingConfig.DISABLED_CLOSE
      });
    }
    this.counterLoading = this.counterLoading + 1;
  }

  hideLoading() {
    if (this.counterLoading === 1) {
      try {
        this.dialogLoading.close();
      } catch (error) {
        console.error(error);
      }
    }
    this.counterLoading = this.counterLoading - 1 < 0 ? 0 : this.counterLoading - 1;
  }

}
