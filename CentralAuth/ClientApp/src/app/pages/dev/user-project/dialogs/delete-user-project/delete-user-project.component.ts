import { Component, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserProject } from 'src/app/models/user-project';
import { ProjectService } from 'src/app/services/project.service';
import { CustomResponse } from 'src/app/models/custom-response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-delete-user-project',
  templateUrl: './delete-user-project.component.html',
  styleUrls: ['./delete-user-project.component.scss']
})
export class DeleteUserProjectComponent implements OnInit {
  apiname = null;
  process = false;
  formSubscription: Subscription;
  formOptionSubscription: Subscription;
  form = this._fb.group({
    nik: [this.data.pengguna.nik, [Validators.required, Validators.pattern('[0-9]+')]],
    nama: [this.data.pengguna.nama, [Validators.required]],
    email: [this.data.pengguna.email, [Validators.required, Validators.email]],
    ext: [this.data.pengguna.ext, [Validators.required, Validators.pattern('[0-9]+')]],
    atasan: [this.data.pengguna.atasan?.nama],
    nikAtasan: [this.data.pengguna.atasanNik],
    unit: [this.data.pengguna.unit?.namaUnit],
    kodeUnit: [this.data.pengguna.unitKode],
    cabang: [ this.data.pengguna.cabang?.namaCabang],
    kodeCabang: [ this.data.pengguna.cabangKode],
    direktorat: [ this.data.pengguna.direktorat?.namaDirektorat],
    kodeDirektorat: [ this.data.pengguna.direktoratKode],
    departemen: [ this.data.pengguna.departemen?.namaDepartemen],
    kodeDepartemen: [ this.data.pengguna.departemenKode],
    subDepartemen: [ this.data.pengguna.subDepartemen?.namaSubDepartemen],
    kodeSubDepartemen: [ this.data.pengguna.subDepartemenKode],
  });

  constructor(
    private _dialogRef: MatDialogRef<DeleteUserProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserProject,
    private _fb: FormBuilder,
    private _projectService: ProjectService,

  ) {
  }

  ngOnInit(): void {
    this.apiname = this.data.projekApiName;

  }

  get nik() {
    return this.form.get('nik');
  }
  get nama() {
    return this.form.get('nama');
  }
  get email() {
    return this.form.get('email');
  }
  get ext() {
    return this.form.get('ext');
  }
  get atasan() {
    return this.form.get('atasan');
  }
  get nikAtasan() {
    return this.form.get('nikAtasan');
  }
  get unit() {
    return this.form.get('unit');
  }
  get kodeUnit() {
    return this.form.get('kodeUnit');
  }
  get cabang() {
    return this.form.get('cabang');
  }
  get kodeCabang() {
    return this.form.get('kodeCabang');
  }
  get direktorat() {
    return this.form.get('direktorat');
  }
  get kodeDirektorat() {
    return this.form.get('kodeDirektorat');
  }
  get departemen() {
    return this.form.get('departemen');
  }
  get kodeDepartemen() {
    return this.form.get('kodeDepartemen');
  }
  get subDepartemen() {
    return this.form.get('subDepartemen');
  }
  get kodeSubDepartemen() {
    return this.form.get('kodeSubDepartemen');
  }
  onNoClick(): void {
    this._dialogRef.close();
  }

  onSubmitClick() {
    if (this.form.valid) {
      this.process = true;
      const payload = new UserProject();
      payload.penggunaNik = this.nik.value;
      payload.projekApiName = this.apiname;
      this.formSubscription = this._projectService
          .removeUserFromProject(payload)
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
              console.log('Form Dialog Create User Project Observer got a complete notification');
            }
          );
    }
  }

}
