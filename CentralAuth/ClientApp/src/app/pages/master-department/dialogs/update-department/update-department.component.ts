import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { DepartmentService } from 'src/app/services/department.service';
import { Subscription } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Directorate } from 'src/app/models/directorate';
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
import { DirectorateService } from 'src/app/services/directorate.service';
import { Filter } from 'src/app/models/commons/filter';
import { GridFilterType } from 'src/app/models/enums/gridfiltertype';
import { Grid } from 'src/app/models/grid';
import { GridResponse } from 'src/app/models/grid-response';

@Component({
  selector: 'app-update-department',
  templateUrl: './update-department.component.html',
  styleUrls: ['./update-department.component.scss']
})
export class UpdateDepartmentComponent implements OnInit, OnDestroy {
  filteredOptions: Directorate[];
  process = false;
  formSubscription: Subscription;
  formOptionSubscription: Subscription;
  form = this._fb.group({
    kode: [this.data.kode, [Validators.required]],
    namaDepartemen: [this.data.namaDepartemen, Validators.required],
    direktoratKode: [this.data.direktoratKode, Validators.required],
    direktorat: [this.data.direktorat?.namaDirektorat, Validators.required],
  });

  constructor(
    private _dialog: MatDialog,
    private _dialogRef: MatDialogRef<UpdateDepartmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Department,
    private _fb: FormBuilder,
    private _departmentService: DepartmentService,
    private _directorateService: DirectorateService,
    private _snackbar: MatSnackBar
  ) {
    this.form.controls['direktorat'].setValue(data.direktorat);
    this.form.controls['direktoratKode'].setValue(data.direktorat.kode);
  }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  get kode() {
    return this.form.get('kode');
  }
  get namaDepartemen() {
    return this.form.get('namaDepartemen');
  }
  get direktoratKode() {
    return this.form.get('direktoratKode');
  }
  get direktorat() {
    return this.form.get('direktorat');
  }
  onSearch(event) {
    let value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (value === undefined || value === null) {
      value = '';
    }
    const filter: Filter = {
      columnName: 'namaDirektorat',
      filterType: GridFilterType.CONTAIN,
      filterValue: value
    };
    const search: Grid = {
      filter:   [filter],
      sort: null,
      pagination: null
    };
    this.formOptionSubscription = this._directorateService.getByFilterGrid(search)
                                      .subscribe(
                                        (data: GridResponse<Directorate>) => {
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
  displayFn(data: Directorate) {
    return data && data.namaDirektorat ? data.namaDirektorat : '';
  }
  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const data = event.option.value as Department;
    this.form.controls['direktoratKode'].setValue(data.kode);
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
      const payload = new Department(this.form.value);
      delete payload.direktorat;
      this.formSubscription = this._departmentService
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
              console.log('Form Dialog Update Department Observer got a complete notification');
            }
          );
    }
  }

}
