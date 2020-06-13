import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Directorate } from 'src/app/models/directorate';
import { DirectorateService } from 'src/app/services/directorate.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomResponse } from 'src/app/models/custom-response';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-create-directorate',
  templateUrl: './create-directorate.component.html',
  styleUrls: ['./create-directorate.component.scss']
})
export class CreateDirectorateComponent implements OnInit, OnDestroy {

  process = false;
  formSubscription: Subscription;
  form = this._fb.group({
    Kode: [this.data.kode, [Validators.required]],
    NamaDirektorat: [this.data.namaDirektorat, Validators.required],
  });

  constructor(
    private _dialogRef: MatDialogRef<CreateDirectorateComponent>,
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
          .create(new Directorate(this.form.value))
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
              console.log('Form Dialog Create Directorate Observer got a complete notification');
            }
          );
    }
  }



}
