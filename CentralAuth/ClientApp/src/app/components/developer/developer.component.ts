import { Component, OnInit, Inject } from '@angular/core';
import { User } from 'src/app/models/user';
import { Unit } from 'src/app/models/unit';
import { Branch } from 'src/app/models/branch';
import { Directorate } from 'src/app/models/directorate';
import { Department } from 'src/app/models/department';
import { SubDepartment } from 'src/app/models/sub-department';
import { Subscription } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { DirectorateService } from 'src/app/services/directorate.service';
import { DepartmentService } from 'src/app/services/department.service';
import { SubDepartmentService } from 'src/app/services/sub-department.service';
import { BranchService } from 'src/app/services/branch.service';
import { UnitService } from 'src/app/services/unit.service';
import { Filter } from 'src/app/models/commons/filter';
import { GridFilterType } from 'src/app/models/enums/gridfiltertype';
import { Grid } from 'src/app/models/grid';
import { GridResponse } from 'src/app/models/grid-response';
import { HttpErrorResponse } from '@angular/common/http';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { UserUpdate } from 'src/app/models/auth/user-update';
import { CustomResponse } from 'src/app/models/custom-response';

@Component({
  selector: 'app-developer',
  templateUrl: './developer.component.html',
  styleUrls: ['./developer.component.scss']
})
export class DeveloperComponent implements OnInit {
  atasanOptions: User[];
  unitOptions: Unit[];
  cabangOptions: Branch[];
  direktoratOptions: Directorate[];
  departemenOptions: Department[];
  subDepartemenOptions: SubDepartment[];
  process = false;
  formSubscription: Subscription;
  formOptionSubscription: Subscription;
  form = this._fb.group({
    nik: [this.data.nik, [Validators.required, Validators.pattern('[0-9]+')]],
    nama: [this.data.nama, [Validators.required]],
    email: [this.data.email, [Validators.required, Validators.email]],
    ext: [this.data.ext, [Validators.required, Validators.pattern('[0-9]+')]],
    atasan: [this.data.atasan?.nama],
    nikAtasan: [this.data.atasanNik],
    unit: [this.data.unit?.namaUnit],
    kodeUnit: [this.data.unitKode],
    cabang: [this.data.cabang?.namaCabang, ],
    kodeCabang: [this.data.cabangKode, ],
    direktorat: [this.data.direktorat?.namaDirektorat, ],
    kodeDirektorat: [this.data.direktoratKode, ],
    departemen: [this.data.departemen?.namaDepartemen, ],
    kodeDepartemen: [this.data.departemenKode, ],
    subDepartemen: [this.data.subDepartemen?.namaSubDepartemen, ],
    kodeSubDepartemen: [this.data.subDepartemenKode, ],
  });

  constructor(
    private _dialogRef: MatDialogRef<DeveloperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private _fb: FormBuilder,
    private _userService: UserService,
    private _directorateService: DirectorateService,
    private _departmentService: DepartmentService,
    private _subDepartmentService: SubDepartmentService,
    private _branchService: BranchService,
    private _unitService: UnitService,
  ) {
    // this.form.controls['unit'].setValue(data.unit);
    // this.form.controls['kodeUnit'].setValue(data.unit?.kode);
    // if (data.unit != null) {
    //   this.form.controls['cabang'].enable();
    //   this.form.controls['kodeCabang'].enable();
    // }
    // this.form.controls['cabang'].setValue(data.cabang);
    // this.form.controls['kodeCabang'].setValue(data.cabang?.kode);
    // if (data.cabang != null) {
    //   this.form.controls['direktorat'].enable();
    //   this.form.controls['kodeDirektorat'].enable();
    // }
    // this.form.controls['direktorat'].setValue(data.direktorat);
    // this.form.controls['kodeDirektorat'].setValue(data.direktorat?.kode);
    // if (data.direktorat != null) {
    //   this.form.controls['departemen'].enable();
    //   this.form.controls['kodeDepartemen'].enable();
    // }
    // this.form.controls['departemen'].setValue(data.departemen);
    // this.form.controls['kodeDepartemen'].setValue(data.departemen?.kode);
    // if (data.departemen != null) {
    //   this.form.controls['subDepartemen'].enable();
    //   this.form.controls['kodeSubDepartemen'].enable();
    // }
    // this.form.controls['subDepartemen'].setValue(data.subDepartemen);
    // this.form.controls['kodeSubDepartemen'].setValue(data.subDepartemen?.kode);
  }

  ngOnInit(): void {
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

}
