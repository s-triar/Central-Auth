import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Directorate } from 'src/app/models/directorate';
import { FormBuilder, Validators } from '@angular/forms';
import { DirectorateService } from 'src/app/services/directorate.service';
import { Subscription } from 'rxjs';
import { CustomResponse } from 'src/app/models/custom-response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-delete-directorate',
  templateUrl: './delete-directorate.component.html',
  styleUrls: ['./delete-directorate.component.scss']
})
export class DeleteDirectorateComponent implements OnInit, OnDestroy {
  process = false;
  formSubscription: Subscription;
  form = this._fb.group({
    Kode: [this.data.kode, [Validators.required]],
    NamaDirektorat: [this.data.namaDirektorat, Validators.required],
  });
  constructor(
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<DeleteDirectorateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Directorate,
    private _directorateService: DirectorateService,
  ) { }

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
          .delete(new Directorate(this.form.value))
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
              console.log('Form Dialog Delete Directorate Observer got a complete notification');
            }
          );
    }
  }
}
