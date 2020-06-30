import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class UtilityService {

  constructor(private _snackbar: MatSnackBar) { }

  copyTextFromElement(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this._snackbar.open('Copied!', null, {duration: 1500});
  }


}
