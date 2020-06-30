import { Component, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project.service';
import { CustomResponse } from 'src/app/models/custom-response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-delete-my-project',
  templateUrl: './delete-my-project.component.html',
  styleUrls: ['./delete-my-project.component.scss']
})
export class DeleteMyProjectComponent implements OnInit {
  process = false;
  formSubscription: Subscription;
  form = this._fb.group({
    apiName: [this.data.apiName, [Validators.required]],
    namaProject: [this.data.namaProject, Validators.required],
    url: [this.data.url, Validators.required],
    type: [this.data.type, Validators.required],
  });
  constructor(
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<DeleteMyProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Project,
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
          .delete(new Project(this.form.value))
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
              console.log('Form Dialog Delete Projek Observer got a complete notification');
            }
          );
    }
  }

}
