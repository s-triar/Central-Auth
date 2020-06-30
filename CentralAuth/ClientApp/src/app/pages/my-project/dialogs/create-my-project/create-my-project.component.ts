import { Component, OnInit, Inject } from '@angular/core';
import { ProjectType } from 'src/app/models/enums/project-type';
import { User } from 'src/app/models/user';
import { Subscription } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomResponse } from 'src/app/models/custom-response';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-create-my-project',
  templateUrl: './create-my-project.component.html',
  styleUrls: ['./create-my-project.component.scss']
})
export class CreateMyProjectComponent implements OnInit {
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
  });

  constructor(
    private _dialogRef: MatDialogRef<CreateMyProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Project,
    private _fb: FormBuilder,
    private _projectService: ProjectService,
    private _authService: AuthService
  ) {

  }

  ngOnInit(): void {
    console.log(this.filteredTypeOptions);
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
                                          }
                                          this.apiName.updateValueAndValidity();
                                          this.formOptionSubscription.unsubscribe();
                                        },
                                        (err: HttpErrorResponse) => {
                                          this.apiChecking = false;
                                          this.formOptionSubscription.unsubscribe();
                                        }
                                      );
    }
  }

  onNoClick(): void {
    this._dialogRef.close();
  }

  onSubmitClick() {
    if (this.form.valid) {
      this.process = true;
      const payload = new Project(this.form.value);
      payload.developerNik = this._authService.user.value.nik;
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
            },
            () => {
              console.log('Form Dialog Create Project Observer got a complete notification');
            }
          );
    }
  }

}
