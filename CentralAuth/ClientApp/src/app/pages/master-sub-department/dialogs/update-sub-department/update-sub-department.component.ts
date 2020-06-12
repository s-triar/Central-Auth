import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { SubDepartment } from 'src/app/models/sub-department';
import { Subscription } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UpdateDepartmentComponent } from 'src/app/pages/master-department/dialogs/update-department/update-department.component';
import { SubDepartmentService } from 'src/app/services/sub-department.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogLoadingComponent } from 'src/app/components/dialog-loading/dialog-loading.component';
import { DialogLoadingConfig } from 'src/app/models/enums/dialog-loading-config';
import { CustomResponse } from 'src/app/models/custom-response';
import { ResponseContextGetter } from 'src/app/utils/response-context-getter';
import { SnackbarNotifComponent } from 'src/app/components/snackbar-notif/snackbar-notif.component';
import { SnackbarNotifConfig } from 'src/app/models/enums/snackbar-config';
import { HttpErrorResponse } from '@angular/common/http';
import { Department } from 'src/app/models/department';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DepartmentService } from 'src/app/services/department.service';
import { GridResponse } from 'src/app/models/grid-response';
import { GridFilterType } from 'src/app/models/enums/gridfiltertype';
import { Filter } from 'src/app/models/commons/filter';
import { Grid } from 'src/app/models/grid';

@Component({
  selector: 'app-update-sub-department',
  templateUrl: './update-sub-department.component.html',
  styleUrls: ['./update-sub-department.component.scss']
})
export class UpdateSubDepartmentComponent implements OnInit, OnDestroy {

  filteredOptions: Department[];
  process = false;
  formSubscription: Subscription;
  formOptionSubscription: Subscription;
  form = this._fb.group({
    kode: [this.data.kode, [Validators.required]],
    namaSubDepartemen: [this.data.namaSubDepartemen, Validators.required],
    departemenKode: [this.data.departemenKode, Validators.required],
    departemen: [this.data.departemen.namaDepartemen, Validators.required],
  });

  constructor(
    private _dialog: MatDialog,
    private _dialogRef: MatDialogRef<UpdateDepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SubDepartment,
    private _fb: FormBuilder,
    private _subDepartmentService: SubDepartmentService,
    private _departemenService: DepartmentService,
    private _snackbar: MatSnackBar
  ) {
    this.form.controls['departemen'].setValue(data.departemen);
    this.form.controls['departemenKode'].setValue(data.departemen.kode);
  }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  get kode() {
    return this.form.get('kode');
  }
  get namaSubDepartemen() {
    return this.form.get('namaSubDepartemen');
  }
  get departemenKode() {
    return this.form.get('departemenKode');
  }
  get departemen() {
    return this.form.get('departemen');
  }

  onSearch(event) {
    let value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (value === undefined || value === null) {
      value = '';
    }
    const filter: Filter = {
      columnName: 'namaDepartemen',
      filterType: GridFilterType.CONTAIN,
      filterValue: value
    };
    const search: Grid = {
      filter:   [filter],
      sort: null,
      pagination: null
    };
    this.formOptionSubscription = this._departemenService.getByFilterGrid(search)
                                      .subscribe(
                                        (data: GridResponse<Department>) => {
                                          this.filteredOptions = data.data;
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

  }
  displayFn(data: Department) {
    return data && data.namaDepartemen ? data.namaDepartemen : '';
  }
  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const data = event.option.value as Department;
    this.form.controls['departemenKode'].setValue(data.kode);
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
      const payload = new SubDepartment(this.form.value);
      delete payload.departemen;
      this.formSubscription = this._subDepartmentService
          .update(payload)
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
              console.log('Form Dialog Update Sub Department Observer got a complete notification');
            }
          );
    }
  }

}
