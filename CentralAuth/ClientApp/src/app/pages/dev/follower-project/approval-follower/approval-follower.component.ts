import { Component, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectToProject } from 'src/app/models/project-to-project';
import { ProjectService } from 'src/app/services/project.service';
import { CustomResponse } from 'src/app/models/custom-response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-approval-follower',
  templateUrl: './approval-follower.component.html',
  styleUrls: ['./approval-follower.component.scss']
})
export class ApprovalFollowerComponent implements OnInit {
  process = false;
  formSubscription: Subscription;
  form = this._fb.group({
    apiName: [this.data.projek.apiName, [Validators.required]],
    namaProject: [this.data.projek.namaProject, Validators.required],
    url: [this.data.projek.url, Validators.required],
    type: [this.data.projek.type, Validators.required],
  });
  constructor(
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<ApprovalFollowerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectToProject,
    private _projectService: ProjectService,
  ) { }

  ngOnInit(): void {
  }
  get apiName() {
    return this.form.get('apiName');
  }
  get namaProject() {
    return this.form.get('namaProject');
  }
  get url() {
    return this.form.get('url');
  }
  get type() {
    return this.form.get('type');
  }
  onNoClick(): void {
    this._dialogRef.close();
  }

  onApprove() {
    if (this.form.valid) {
      this.process = true;
      this.data.approve = true;
      this.formSubscription = this._projectService
          .approvalFollower(this.data)
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
              console.log('Form Dialog Approval Follower Projek Observer got a complete notification');
            }
          );
    }
  }

  onNotApprove() {
    if (this.form.valid) {
      this.process = true;
      this.data.approve = false;

      this.formSubscription = this._projectService
          .approvalFollower(this.data)
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
              console.log('Form Dialog Approval Follower Projek Observer got a complete notification');
            }
          );
    }
  }

}
