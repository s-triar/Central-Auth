import { Component, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Separator } from 'src/app/models/enums/separator';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Role } from 'src/app/models/role';
import { ProjectService } from 'src/app/services/project.service';
import { CustomResponse } from 'src/app/models/custom-response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-delete-role-project',
  templateUrl: './delete-role-project.component.html',
  styleUrls: ['./delete-role-project.component.scss']
})
export class DeleteRoleProjectComponent implements OnInit {
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
    private _dialogRef: MatDialogRef<DeleteRoleProjectComponent>,
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
  onNoClick(): void {
    this._dialogRef.close();
  }
  onSubmitClick() {
    if (this.form.valid) {
      this.process = true;
      const payload = new Role(this.form.value);
      this.formSubscription = this._projectService
          .removeRoleProject(payload)
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
              console.log('Form Dialog Delete Role Project Observer got a complete notification');
            }
          );
    }
  }

}
