import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { BranchService } from 'src/app/services/branch.service';
import { Branch } from 'src/app/models/branch';
import { Subscription } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomResponse } from 'src/app/models/custom-response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-branch',
  templateUrl: './create-branch.component.html',
  styleUrls: ['./create-branch.component.scss']
})
export class CreateBranchComponent implements OnInit, OnDestroy {

  process = false;
  formSubscription: Subscription;
  form = this._fb.group({
    kode: [this.data.kode, [Validators.required]],
    singkatan: [this.data.singkatan, Validators.required],
    namaCabang: [this.data.namaCabang, Validators.required],
    alamat: [this.data.alamat, Validators.required],
    keterangan: [this.data.keterangan],
  });

  constructor(
    private _dialogRef: MatDialogRef<CreateBranchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Branch,
    private _fb: FormBuilder,
    private _branchService: BranchService,
  ) {

  }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  get kode() {
    return this.form.get('kode');
  }
  get namaCabang() {
    return this.form.get('namaCabang');
  }
  get alamat() {
    return this.form.get('alamat');
  }
  get singkatan() {
    return this.form.get('singkatan');
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
      this.formSubscription = this._branchService
          .create(new Branch(this.form.value))
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
              console.log('Form Dialog Create Branch Observer got a complete notification');
            }
          );
    }
  }

}
