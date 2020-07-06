import { Component, OnInit, Inject } from '@angular/core';
import { ClaimProject } from 'src/app/models/claim-project';
import { Validators, FormBuilder } from '@angular/forms';
import { Separator } from 'src/app/models/enums/separator';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from 'src/app/services/project.service';
import { CustomResponse } from 'src/app/models/custom-response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-delete-claim-project',
  templateUrl: './delete-claim-project.component.html',
  styleUrls: ['./delete-claim-project.component.scss']
})
export class DeleteClaimProjectComponent implements OnInit {
  process = false;
  formSubscription: Subscription;
  formOptionSubscription: Subscription;
  apiname = null;
  separator = Separator;
  form = this._fb.group({
    id : [this.data.id, [Validators.required]],
    claimName: [this.data.claimName, [Validators.required]],
    projekApiName: [this.data.projekApiName, [Validators.required]]
  });

  constructor(
    private _dialogRef: MatDialogRef<DeleteClaimProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClaimProject,
    private _fb: FormBuilder,
    private _projectService: ProjectService,
  ) {
  }

  ngOnInit(): void {
    this.apiname = this.data.projekApiName;
    this.claimName.setErrors({
      notUnique: null
    });
  }

  get claimName() {
    return this.form.get('claimName');
  }
  onNoClick(): void {
    this._dialogRef.close();
  }
  onSubmitClick() {
    if (this.form.valid) {
      this.process = true;
      const payload = new ClaimProject(this.form.value);
      this.formSubscription = this._projectService
          .removeClaimProject(payload)
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
              console.log('Form Dialog Delete Claim Project Observer got a complete notification');
            }
          );
    }
  }
}
