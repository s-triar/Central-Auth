import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Unit } from 'src/app/models/unit';
import { UnitService } from 'src/app/services/unit.service';
import { CustomResponse } from 'src/app/models/custom-response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-update-unit',
  templateUrl: './update-unit.component.html',
  styleUrls: ['./update-unit.component.scss']
})
export class UpdateUnitComponent implements OnInit, OnDestroy {

  process = false;
  formSubscription: Subscription;
  form = this._fb.group({
    kode: [this.data.kode, [Validators.required]],
    namaUnit: [this.data.namaUnit, Validators.required],
    keterangan: [this.data.keterangan],
  });

  constructor(
    private _dialogRef: MatDialogRef<UpdateUnitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Unit,
    private _fb: FormBuilder,
    private _unitService: UnitService,
  ) {

  }
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
  get keterangan() {
    return this.form.get('keterangan');
  }

  onNoClick(): void {
    this._dialogRef.close();
  }

  onSubmitClick() {
    if (this.form.valid) {
      this.process = true;
      this.formSubscription = this._unitService
          .update(new Unit(this.form.value))
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
              console.log('Form Dialog Update Unit Observer got a complete notification');
            }
          );
    }
  }

}
