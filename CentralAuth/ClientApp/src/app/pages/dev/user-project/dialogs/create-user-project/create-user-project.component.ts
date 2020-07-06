import { Component, OnInit, Inject } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { UserProject } from 'src/app/models/user-project';
import { User } from 'src/app/models/user';
import { Subscription } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Filter } from 'src/app/models/commons/filter';
import { GridFilterType } from 'src/app/models/enums/gridfiltertype';
import { Grid } from 'src/app/models/grid';
import { GridResponse } from 'src/app/models/grid-response';
import { HttpErrorResponse } from '@angular/common/http';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CustomResponse } from 'src/app/models/custom-response';

@Component({
  selector: 'app-create-user-project',
  templateUrl: './create-user-project.component.html',
  styleUrls: ['./create-user-project.component.scss']
})
export class CreateUserProjectComponent implements OnInit {
  apiname = null;
  userOptions: User[];
  process = false;
  formSubscription: Subscription;
  formOptionSubscription: Subscription;
  form = this._fb.group({
    nik: [this.data.pengguna.nik, [Validators.required]],
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
    private _dialogRef: MatDialogRef<CreateUserProjectComponent>,
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
  onSearch(event) {
    let value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (value === undefined || value === null) {
      value = '';
    }
    const filter: Filter = {
      columnName: 'nik',
      filterType: GridFilterType.CONTAIN,
      filterValue: value
    };
    const search: Grid = {
      filter:   [filter],
      sort: null,
      pagination: null
    };
    this.formOptionSubscription = this._projectService.getAvailableUserProject(search, this.apiname, true)
                                      .subscribe(
                                        (data: GridResponse<User>) => {
                                          this.userOptions = data.data;
                                          this.formOptionSubscription.unsubscribe();
                                        },
                                        (err: HttpErrorResponse) => {
                                          this.formOptionSubscription.unsubscribe();
                                        }
                                      );
  }

  displayFn(data: User) {
    return data && data.nik ? data.nik : '';
  }
  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const data = event.option.value;
    this.nama.setValue(data.nama);
    this.email.setValue(data.email);
    this.ext.setValue(data.ext);
    this.atasan.setValue(data.atasan.nama);
    this.nikAtasan.setValue(data.nikAtasan);
    this.kodeUnit.setValue(data.kodeUnit);
    this.unit.setValue(data.unit.namaUnit);
    this.kodeCabang.setValue(data.kodeCabang);
    this.cabang.setValue(data.cabang.namaCabang);
    this.direktorat.setValue(data.direktorat.namaDirektorat);
    this.kodeDirektorat.setValue(data.kodeDirektorat);
    this.departemen.setValue(data.departemen.namaDepartemen);
    this.kodeDepartemen.setValue(data.kodeDepartemen);
    this.subDepartemen.setValue(data.subDepartemen.namaSubDepartemen);
    this.kodeSubDepartemen.setValue(data.kodeSubDepartemen);
  }
  onNoClick(): void {
    this._dialogRef.close();
  }

  onSubmitClick() {
    if (this.form.valid) {
      this.process = true;
      const payload = new UserProject();
      payload.penggunaNik = this.nik.value.nik;
      payload.projekApiName = this.apiname;
      this.formSubscription = this._projectService
          .addUserToProject(payload)
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
