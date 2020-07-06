import { Component, OnInit, Inject } from '@angular/core';
import { ProjectToProject } from 'src/app/models/project-to-project';
import { Project } from 'src/app/models/project';
import { Subscription } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from 'src/app/services/project.service';
import { Filter } from 'src/app/models/commons/filter';
import { GridFilterType } from 'src/app/models/enums/gridfiltertype';
import { Grid } from 'src/app/models/grid';
import { GridResponse } from 'src/app/models/grid-response';
import { HttpErrorResponse } from '@angular/common/http';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CustomResponse } from 'src/app/models/custom-response';

@Component({
  selector: 'app-create-following-project',
  templateUrl: './create-following-project.component.html',
  styleUrls: ['./create-following-project.component.scss']
})
export class CreateFollowingProjectComponent implements OnInit {

  process = false;
  formSubscription: Subscription;
  formOptionSubscription: Subscription;
  filteredOptions: Project[] = [];
  form = this._fb.group({
    apiName: ['', [Validators.required]],
    url: ['', [Validators.required]],
    type: ['', [Validators.required]],
    namaProject: ['', [Validators.required]],
  });

  constructor(
    private _dialogRef: MatDialogRef<CreateFollowingProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectToProject,
    private _fb: FormBuilder,
    private _projectService: ProjectService,
  ) {

  }

  ngOnInit(): void {

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


  onSearch(event) {
    let value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (value === undefined || value === null) {
      value = '';
    }
    const filter: Filter = {
      columnName: 'apiName',
      filterType: GridFilterType.CONTAIN,
      filterValue: value
    };
    const search: Grid = {
      filter: [filter],
      sort: null,
      pagination: null
    };
    this.formOptionSubscription = this._projectService.getAvailabilityFollowingGrid(search, this.data.projekApiName, true)
                                      .subscribe(
                                        (data: GridResponse<Project>) => {
                                          this.filteredOptions = data.data;
                                          this.formOptionSubscription.unsubscribe();
                                        },
                                        (err: HttpErrorResponse) => {
                                          this.formOptionSubscription.unsubscribe();
                                        }
                                      );
  }
  displayFn(data: Project) {
    return data && data['apiName'] ? data['apiName'] : '';
  }
  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const data = event.option.value as Project;
    this.form.controls['namaProject'].setValue(data.namaProject);
    this.form.controls['url'].setValue(data.url);
    this.form.controls['type'].setValue(data.type);
  }

  onNoClick(): void {
    this._dialogRef.close();
  }

  onSubmitClick() {
    if (this.form.valid) {
      this.process = true;
      const payload = new ProjectToProject({projekApiName: this.data.projekApiName, kolaborasiApiName: this.apiName.value.apiName});
      this.formSubscription = this._projectService
          .followProject(payload)
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
              console.log('Form Dialog Create Following Project Observer got a complete notification');
            }
          );
    }
  }

}
