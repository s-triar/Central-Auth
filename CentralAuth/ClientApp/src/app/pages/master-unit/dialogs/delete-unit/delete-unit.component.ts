import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { UnitService } from 'src/app/services/unit.service';
import { Subscription } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Unit } from 'src/app/models/unit';
import { CustomResponse } from 'src/app/models/custom-response';
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
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<DeleteUnitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Unit,
    private _unitService: UnitService,
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
      this.formSubscription = this._unitService
          .delete(new Unit(this.form.value))
          .subscribe(
            (x: CustomResponse<any>) => {
              this.formSubscription.unsubscribe();
              this.process = false;
              this._dialogRef.close(true);
            },
            (err: HttpErrorResponse) => {
              this.formSubscription.unsubscribe();
              this.process = false;
            },
            () => {
              console.log('Form Dialog Delete Unit Observer got a complete notification');
            }
          );
    }
  }
}
