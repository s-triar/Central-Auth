import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarNotifComponent } from '../components/snackbar-notif/snackbar-notif.component';
import { SnackbarNotifConfig } from '../models/enums/snackbar-config';

@Injectable({
  providedIn: 'root'
})
export class NotifSnackbarService {
    constructor(private _snackbar: MatSnackBar) { }
    showSnack(context: any) {
      this._snackbar.openFromComponent(SnackbarNotifComponent, {
        duration: SnackbarNotifConfig.DURATION,
        data: context,
        horizontalPosition: <any>SnackbarNotifConfig.HORIZONTAL_POSITION,
        verticalPosition: <any>SnackbarNotifConfig.VERTICAL_POSITION
      });
    }
}
