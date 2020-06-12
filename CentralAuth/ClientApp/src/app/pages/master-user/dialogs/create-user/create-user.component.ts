import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { DepartmentService } from 'src/app/services/department.service';
import { SubDepartmentService } from 'src/app/services/sub-department.service';
import { BranchService } from 'src/app/services/branch.service';
import { UnitService } from 'src/app/services/unit.service';
import { DirectorateService } from 'src/app/services/directorate.service';
import { Directorate } from 'src/app/models/directorate';
import { Subscription } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Filter } from 'src/app/models/commons/filter';
import { GridFilterType } from 'src/app/models/enums/gridfiltertype';
import { Grid } from 'src/app/models/grid';
import { GridResponse } from 'src/app/models/grid-response';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseContextGetter } from 'src/app/utils/response-context-getter';
import { SnackbarNotifComponent } from 'src/app/components/snackbar-notif/snackbar-notif.component';
import { SnackbarNotifConfig } from 'src/app/models/enums/snackbar-config';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DialogLoadingComponent } from 'src/app/components/dialog-loading/dialog-loading.component';
import { DialogLoadingConfig } from 'src/app/models/enums/dialog-loading-config';
import { CustomResponse } from 'src/app/models/custom-response';
import { SimpleGenericService } from 'src/app/services/simple-generic.service';
import { Unit } from 'src/app/models/unit';
import { Branch } from 'src/app/models/branch';
import { Department } from 'src/app/models/department';
import { SubDepartment } from 'src/app/models/sub-department';
import { UserRegister } from 'src/app/models/auth/user-register';
import { GenerateRandom } from 'src/app/utils/generate-random';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit, OnDestroy {
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
    cabang: [{value: this.data.cabang?.namaCabang, disabled: true}],
    kodeCabang: [{value: this.data.cabangKode, disabled: true}],
    direktorat: [{value: this.data.direktorat?.namaDirektorat, disabled: true}],
    kodeDirektorat: [{value: this.data.direktoratKode, disabled: true}],
    departemen: [{value: this.data.departemen?.namaDepartemen, disabled: true}],
    kodeDepartemen: [{value: this.data.departemenKode, disabled: true}],
    subDepartemen: [{value: this.data.subDepartemen?.namaSubDepartemen, disabled: true}],
    kodeSubDepartemen: [{value: this.data.subDepartemenKode, disabled: true}],
  });

  constructor(
    private _dialog: MatDialog,
    private _dialogRef: MatDialogRef<CreateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private _fb: FormBuilder,
    private _userService: UserService,
    private _directorateService: DirectorateService,
    private _departmentService: DepartmentService,
    private _subDepartmentService: SubDepartmentService,
    private _branchService: BranchService,
    private _unitService: UnitService,
    private _snackbar: MatSnackBar
  ) {

  }
  ngOnDestroy(): void {
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

  onSearch(event, kelas, kolom) {
    let value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (value === undefined || value === null) {
      value = '';
    }
    const filter: Filter = {
      columnName: kolom,
      filterType: GridFilterType.CONTAIN,
      filterValue: value
    };
    const search: Grid = {
      filter:   [filter],
      sort: null,
      pagination: null
    };
    this.getList(kelas, search);
  }
  private getList(kelas: string, search: Grid) {
    let koloms: string[] = [];
    let filterTambahan: Filter = null;
    switch (kelas) {
      case 'USER':
        this.formOptionSubscription = this._userService.getByFilterGrid(search)
                                      .subscribe(
                                        (data: GridResponse<User>) => {
                                          this.atasanOptions = data.data;
                                          this.formOptionSubscription.unsubscribe();
                                        },
                                        (err: HttpErrorResponse) => {
                                          const context = ResponseContextGetter.GetErrorContext<any>(err);
                                          this._snackbar.openFromComponent(SnackbarNotifComponent, {
                                            duration: SnackbarNotifConfig.DURATION,
                                            data: context,
                                            horizontalPosition: <any>SnackbarNotifConfig.HORIZONTAL_POSITION,
                                            verticalPosition: <any>SnackbarNotifConfig.VERTICAL_POSITION
                                          });
                                          this.formOptionSubscription.unsubscribe();
                                        }
                                      );
        break;
      case 'UNIT':
        koloms = ['cabang', 'kodeCabang',
                        'direktorat', 'kodeDirektorat',
                        'departemen', 'kodeDepartemen',
                        'subDepartemen', 'kodeSubDepartemen'];
        this.clearForm(koloms);
        this.formOptionSubscription = this._unitService.getByFilterGrid(search)
                                        .subscribe(
                                          (data: GridResponse<Unit>) => {
                                            this.unitOptions = data.data;
                                            this.formOptionSubscription.unsubscribe();
                                          },
                                          (err: HttpErrorResponse) => {
                                            const context = ResponseContextGetter.GetErrorContext<any>(err);
                                            this._snackbar.openFromComponent(SnackbarNotifComponent, {
                                              duration: SnackbarNotifConfig.DURATION,
                                              data: context,
                                              horizontalPosition: <any>SnackbarNotifConfig.HORIZONTAL_POSITION,
                                              verticalPosition: <any>SnackbarNotifConfig.VERTICAL_POSITION
                                            });
                                            this.formOptionSubscription.unsubscribe();
                                          }
                                        );
        break;
      case 'BRANCH':
        koloms = ['direktorat', 'kodeDirektorat',
                        'departemen', 'kodeDepartemen',
                        'subDepartemen', 'kodeSubDepartemen'];
        this.clearForm(koloms);
        this.formOptionSubscription = this._branchService.getByFilterGrid(search)
                                        .subscribe(
                                          (data: GridResponse<Branch>) => {
                                            this.cabangOptions = data.data;
                                            this.formOptionSubscription.unsubscribe();
                                          },
                                          (err: HttpErrorResponse) => {
                                            const context = ResponseContextGetter.GetErrorContext<any>(err);
                                            this._snackbar.openFromComponent(SnackbarNotifComponent, {
                                              duration: SnackbarNotifConfig.DURATION,
                                              data: context,
                                              horizontalPosition: <any>SnackbarNotifConfig.HORIZONTAL_POSITION,
                                              verticalPosition: <any>SnackbarNotifConfig.VERTICAL_POSITION
                                            });
                                            this.formOptionSubscription.unsubscribe();
                                          }
                                        );
        break;
      case 'DIRECTORATE':
        koloms = ['departemen', 'kodeDepartemen',
                        'subDepartemen', 'kodeSubDepartemen'];
        this.clearForm(koloms);
        this.formOptionSubscription = this._directorateService.getByFilterGrid(search)
                                        .subscribe(
                                          (data: GridResponse<Directorate>) => {
                                            this.direktoratOptions = data.data;
                                            this.formOptionSubscription.unsubscribe();
                                          },
                                          (err: HttpErrorResponse) => {
                                            const context = ResponseContextGetter.GetErrorContext<any>(err);
                                            this._snackbar.openFromComponent(SnackbarNotifComponent, {
                                              duration: SnackbarNotifConfig.DURATION,
                                              data: context,
                                              horizontalPosition: <any>SnackbarNotifConfig.HORIZONTAL_POSITION,
                                              verticalPosition: <any>SnackbarNotifConfig.VERTICAL_POSITION
                                            });
                                            this.formOptionSubscription.unsubscribe();
                                          }
                                        );
        break;
      case 'DEPARTMENT':
        koloms = ['subDepartemen', 'kodeSubDepartemen'];
        this.clearForm(koloms);
        filterTambahan = {
          columnName: 'direktoratKode',
          filterType: GridFilterType.EQUAL,
          filterValue: this.kodeDirektorat.value
        };
        search.filter.push(filterTambahan);
        this.formOptionSubscription = this._departmentService.getByFilterGrid(search)
                                        .subscribe(
                                          (data: GridResponse<Department>) => {
                                            this.departemenOptions = data.data;
                                            this.formOptionSubscription.unsubscribe();
                                          },
                                          (err: HttpErrorResponse) => {
                                            const context = ResponseContextGetter.GetErrorContext<any>(err);
                                            this._snackbar.openFromComponent(SnackbarNotifComponent, {
                                              duration: SnackbarNotifConfig.DURATION,
                                              data: context,
                                              horizontalPosition: <any>SnackbarNotifConfig.HORIZONTAL_POSITION,
                                              verticalPosition: <any>SnackbarNotifConfig.VERTICAL_POSITION
                                            });
                                            this.formOptionSubscription.unsubscribe();
                                          }
                                        );
        break;
      case 'SUBDEPARTMENT':
        filterTambahan = {
          columnName: 'departemenKode',
          filterType: GridFilterType.EQUAL,
          filterValue: this.kodeDepartemen.value
        };
        search.filter.push(filterTambahan);
        this.formOptionSubscription = this._subDepartmentService.getByFilterGrid(search)
                                        .subscribe(
                                          (data: GridResponse<SubDepartment>) => {
                                            this.subDepartemenOptions = data.data;
                                            this.formOptionSubscription.unsubscribe();
                                          },
                                          (err: HttpErrorResponse) => {
                                            const context = ResponseContextGetter.GetErrorContext<any>(err);
                                            this._snackbar.openFromComponent(SnackbarNotifComponent, {
                                              duration: SnackbarNotifConfig.DURATION,
                                              data: context,
                                              horizontalPosition: <any>SnackbarNotifConfig.HORIZONTAL_POSITION,
                                              verticalPosition: <any>SnackbarNotifConfig.VERTICAL_POSITION
                                            });
                                            this.formOptionSubscription.unsubscribe();
                                          }
                                        );
        break;
      default:
        break;
    }
  }

  clearForm(koloms: string[]) {
    for (const k of koloms) {
      this.form.controls[k].setValue(null);
      this.form.controls[k].disable();
    }
  }
  displayFn(data: any) {
    if (data === null || data === undefined) {
      return '';
    } else if ('nama' in data) {
      return data && data['nama'] ? data['nama'] : '';
    } else if ('namaCabang' in data) {
      return data && data['namaCabang'] ? data['namaCabang'] : '';
    } else if ('namaUnit' in data) {
      return data && data['namaUnit'] ? data['namaUnit'] : '';
    } else if ('namaDirektorat' in data) {
      return data && data['namaDirektorat'] ? data['namaDirektorat'] : '';
    } else if ('namaDepartemen' in data) {
      return data && data['namaDepartemen'] ? data['namaDepartemen'] : '';
    } else if ('namaSubDepartemen' in data) {
      return data && data['namaSubDepartemen'] ? data['namaSubDepartemen'] : '';
    } else {
      return '';
    }

  }
  onOptionSelected(event: MatAutocompleteSelectedEvent, kolom: string, kolom_data: string, koloms_enable: string[]) {
    const data = event.option.value;
    this.form.controls[kolom].setValue(data[kolom_data]);
    for (let index = 0; index < koloms_enable.length; index++) {
      const element = koloms_enable[index];
      this.form.controls[element].enable();
    }
  }
  onNoClick(): void {
    this._dialogRef.close();
  }

  onSubmitClick() {
    if (this.form.valid) {
      this.process = true;
      const dialogLoading = this._dialog.open(DialogLoadingComponent, {
        minWidth: DialogLoadingConfig.MIN_WIDTH,
        disableClose: DialogLoadingConfig.DISABLED_CLOSE
      });
      const payload = new UserRegister(this.form.value);
      const password = GenerateRandom.GenerateString(3);
      console.log(password);
      payload.password = password;
      payload.confirmPassword = password;
      console.log(payload);
      this.formSubscription = this._userService
          .registerAccount(payload)
          .subscribe(
            (x: CustomResponse<any>) => {
              const context = ResponseContextGetter.GetCustomResponseContext<any>(x);
              this._snackbar.openFromComponent(SnackbarNotifComponent, {
                duration: SnackbarNotifConfig.DURATION,
                data: context,
                horizontalPosition: <any>SnackbarNotifConfig.HORIZONTAL_POSITION,
                verticalPosition: <any>SnackbarNotifConfig.VERTICAL_POSITION
              });
              this.formSubscription.unsubscribe();
              dialogLoading.close();
              this._dialogRef.close(true);
            },
            (err: HttpErrorResponse) => {
              const context = ResponseContextGetter.GetErrorContext<any>(err);
                this._snackbar.openFromComponent(SnackbarNotifComponent, {
                duration: SnackbarNotifConfig.DURATION,
                data: context,
                horizontalPosition: <any>SnackbarNotifConfig.HORIZONTAL_POSITION,
                verticalPosition: <any>SnackbarNotifConfig.VERTICAL_POSITION
              });
              this.formSubscription.unsubscribe();
              dialogLoading.close();
            },
            () => {
              console.log('Form Dialog Create User Observer got a complete notification');
            }
          );
    }
  }

}
