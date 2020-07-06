import { Component, OnInit, Inject } from '@angular/core';
import { Project } from 'src/app/models/project';
import { Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from 'src/app/services/project.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomResponse } from 'src/app/models/custom-response';
import { Separator } from 'src/app/models/enums/separator';
import { Role } from 'src/app/models/role';

@Component({
  selector: 'app-create-role-project',
  templateUrl: './create-role-project.component.html',
  styleUrls: ['./create-role-project.component.scss']
})
export class CreateRoleProjectComponent implements OnInit {
  isAvailable = false;
  checking = false;
  process = false;
  formSubscription: Subscription;
  formOptionSubscription: Subscription;
  apiname = null;
  separator = Separator;
  form = this._fb.group({
    name: ['', [Validators.required]],
  });

  constructor(
    private _dialogRef: MatDialogRef<CreateRoleProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private _fb: FormBuilder,
    private _projectService: ProjectService,
  ) {
  }

  ngOnInit(): void {
    this.apiname = this.data;
    this.name.setErrors({
      notUnique: null
    });
  }

  get name() {
    return this.form.get('name');
  }

  setLoadingChecking(event) {
    this.checking = true;
  }
  onCheck(event) {
    const value = (event.target as HTMLInputElement).value.trim();
    if (value === '') {
      this.checking = false;
      this.isAvailable = false;
      this.name.setErrors({
        notUnique: true
      });
      this.name.updateValueAndValidity();

    } else {
      this.checking = true;
      this.formOptionSubscription = this._projectService.checkRoleName(this.apiname + this.separator + value)
                                      .subscribe(
                                        (data: boolean) => {
                                          this.checking = false;
                                          this.isAvailable = data;
                                          if (data === false) {
                                            this.name.setErrors({
                                              notUnique: true
                                            });
                                          } else {
                                            this.name.setErrors({
                                              notUnique: null
                                            });
                                            this.name.updateValueAndValidity();
                                          }
                                          this.formOptionSubscription.unsubscribe();
                                        },
                                        (err: HttpErrorResponse) => {
                                          this.checking = false;
                                          this.formOptionSubscription.unsubscribe();
                                        }
                                      );
    }
  }

  onNoClick(): void {
    this._dialogRef.close();
  }

  onSubmitClick() {
    if (this.form.valid || this.form.errors == null) {
      this.process = true;
      const payload = new Role(this.form.value);
      payload.projectApiName = this.apiname;
      this.formSubscription = this._projectService
          .addRoleToProject(payload)
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
              console.log('Form Dialog Create Role Project Observer got a complete notification');
            }
          );
    }
  }

}
