import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Directorate } from 'src/app/models/directorate';
import { DirectorateService } from 'src/app/services/directorate.service';
import { CustomResponse } from 'src/app/models/custom-response';
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
    private _dialogRef: MatDialogRef<UpdateDirectorateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Directorate,
    private _fb: FormBuilder,
    private _directorateService: DirectorateService,
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
      this.formSubscription = this._directorateService
          .update(new Directorate(this.form.value))
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
              console.log('Form Dialog Update Directorate Observer got a complete notification');
            }
          );
    }
  }

}
