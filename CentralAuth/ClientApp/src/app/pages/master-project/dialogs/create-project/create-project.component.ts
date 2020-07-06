import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Project } from 'src/app/models/project';
import { Subscription } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Filter } from 'src/app/models/commons/filter';
import { GridFilterType } from 'src/app/models/enums/gridfiltertype';
import { Grid } from 'src/app/models/grid';
import { User } from 'src/app/models/user';
import { GridResponse } from 'src/app/models/grid-response';
import { HttpErrorResponse } from '@angular/common/http';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CustomResponse } from 'src/app/models/custom-response';
import { ProjectType } from 'src/app/models/enums/project-type';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {
  isApiNameAvailable = false;
  apiChecking = false;
  filteredTypeOptions: string[] = ProjectType;
  filteredOptions: User[];
  process = false;
  formSubscription: Subscription;
  formOptionSubscription: Subscription;

  form = this._fb.group({
    apiName: [this.data.apiName, [Validators.required]],
    url: [this.data.url, [Validators.required]],
    type: [this.data.type, [Validators.required]],
    namaProject: [this.data.namaProject, [Validators.required]],
    developerNik: [this.data.developerNik, [Validators.required]],
    developer: [this.data.developer?.nama, [Validators.required]],
  });

  constructor(
    private _dialogRef: MatDialogRef<CreateProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Project,
    private _fb: FormBuilder,
    private _projectService: ProjectService,
    private _userService: UserService
  ) {

  }

  ngOnInit(): void {
    this.apiName.setErrors({
      notUnique: null
    });
  }

  get apiName() {
    return this.form.get('apiName');
  }
  get url() {
    return this.form.get('url');
  }
  get type() {
    return this.form.get('type');
  }
  get namaProject() {
    return this.form.get('namaProject');
  }
  get developerNik() {
    return this.form.get('developerNik');
  }
  get developer() {
    return this.form.get('developer');
  }
  setLoadingChecking(event) {
    this.apiChecking = true;
  }
  onCheckApiName(event) {
    const value = (event.target as HTMLInputElement).value.trim();
    if (value === '') {
      this.apiChecking = false;
      this.isApiNameAvailable = false;
      this.apiName.setErrors({
        notUnique: true
      });
      this.apiName.updateValueAndValidity();

    } else {
      this.apiChecking = true;
      this.formOptionSubscription = this._projectService.checkApiName(value)
                                      .subscribe(
                                        (data: boolean) => {
                                          this.apiChecking = false;
                                          this.isApiNameAvailable = data;
                                          if (data === false) {
                                            this.apiName.setErrors({
                                              notUnique: true
                                            });
                                          } else {
                                            this.apiName.setErrors({
                                              notUnique: null
                                            });
                                          this.apiName.updateValueAndValidity();
                                          }
                                          this.formOptionSubscription.unsubscribe();
                                        },
                                        (err: HttpErrorResponse) => {
                                          this.apiChecking = false;
                                          this.formOptionSubscription.unsubscribe();
                                        }
                                      );
    }
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
      filter: [filter],
      sort: null,
      pagination: null
    };
    this.formOptionSubscription = this._userService.getByFilterGrid(search, true)
                                      .subscribe(
                                        (data: GridResponse<User>) => {
                                          this.filteredOptions = data.data;
                                          this.formOptionSubscription.unsubscribe();
                                        },
                                        (err: HttpErrorResponse) => {
                                          this.formOptionSubscription.unsubscribe();
                                        }
                                      );

  }
  displayFn(data: User) {
    return data && data['nik'] ? data['nik'] : '';
  }
  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const data = event.option.value as User;
    this.form.controls['developer'].setValue(data.nama);
  }

  onNoClick(): void {
    this._dialogRef.close();
  }

  onSubmitClick() {
    if (this.form.valid) {
      this.process = true;
      const temp = this.form.value['developerNik'];
      this.developerNik.setValue(temp['nik']);
      const payload = new Project(this.form.value);
      delete payload.developer;
      this.formSubscription = this._projectService
          .create(payload)
          .subscribe(
            (x: CustomResponse<any>) => {
              this.formSubscription.unsubscribe();
              this._dialogRef.close(true);
            },
            (err: HttpErrorResponse) => {
              this.formSubscription.unsubscribe();
              this.process = false;
              this.developerNik.setValue(temp);
            },
            () => {
              console.log('Form Dialog Create Project (SuperAdmin) Observer got a complete notification');
            }
          );
    }
  }

}
