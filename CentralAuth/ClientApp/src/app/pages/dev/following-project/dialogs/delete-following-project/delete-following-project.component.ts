import { Component, OnInit, Inject } from '@angular/core';
import { ProjectToProject } from 'src/app/models/project-to-project';
import { ProjectService } from 'src/app/services/project.service';
import { Subscription } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomResponse } from 'src/app/models/custom-response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-delete-following-project',
  templateUrl: './delete-following-project.component.html',
  styleUrls: ['./delete-following-project.component.scss']
})
export class DeleteFollowingProjectComponent implements OnInit {

  process = false;
  formSubscription: Subscription;
  form = this._fb.group({
    apiName: [this.data.kolaborasi.apiName, [Validators.required]],
    namaProject: [this.data.kolaborasi.namaProject, Validators.required],
    url: [this.data.kolaborasi.url, Validators.required],
    type: [this.data.kolaborasi.type, Validators.required],
  });
  constructor(
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<DeleteFollowingProjectComponent>,
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

  onSubmitClick() {
    if (this.form.valid) {
      this.process = true;
      this.formSubscription = this._projectService
          .removefollow(this.data)
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
              console.log('Form Dialog Delete Follow Projek Observer got a complete notification');
            }
          );
    }
  }

}
