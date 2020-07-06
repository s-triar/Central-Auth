import { Component, OnInit, Inject } from '@angular/core';
import { Role } from 'src/app/models/role';
import { Subscription } from 'rxjs';
import { Separator } from 'src/app/models/enums/separator';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from 'src/app/services/project.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomResponse } from 'src/app/models/custom-response';

@Component({
  selector: 'app-update-role-project',
  templateUrl: './update-role-project.component.html',
  styleUrls: ['./update-role-project.component.scss']
})
export class UpdateRoleProjectComponent implements OnInit {
  isAvailable = false;
  checking = false;
  process = false;
  formSubscription: Subscription;
  formOptionSubscription: Subscription;
  apiname = null;
  separator = Separator;
  form = this._fb.group({
    id : [this.data.id, [Validators.required]],
    name: [this.data.name, [Validators.required]],
    projectApiName: [this.data.projectApiName, [Validators.required]]
  });

  constructor(
    private _dialogRef: MatDialogRef<UpdateRoleProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Role,
    private _fb: FormBuilder,
    private _projectService: ProjectService,
  ) {
  }

  ngOnInit(): void {
    this.apiname = this.data.projectApiName;
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
    if (this.form.valid) {
      this.process = true;
      const payload = new Role(this.form.value);
      this.formSubscription = this._projectService
          .editRoleProject(payload)
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
              console.log('Form Dialog Update Role Project Observer got a complete notification');
            }
          );
    }
  }

}
