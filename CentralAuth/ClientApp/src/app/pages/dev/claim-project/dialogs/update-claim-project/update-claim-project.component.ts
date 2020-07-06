import { Component, OnInit, Inject } from '@angular/core';
import { ClaimProject } from 'src/app/models/claim-project';
import { Subscription } from 'rxjs';
import { Separator } from 'src/app/models/enums/separator';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from 'src/app/services/project.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomResponse } from 'src/app/models/custom-response';

@Component({
  selector: 'app-update-claim-project',
  templateUrl: './update-claim-project.component.html',
  styleUrls: ['./update-claim-project.component.scss']
})
export class UpdateClaimProjectComponent implements OnInit {
  isAvailable = false;
  checking = false;
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
    private _dialogRef: MatDialogRef<UpdateClaimProjectComponent>,
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

  setLoadingChecking(event) {
    this.checking = true;
  }
  onCheck(event) {
    const value = (event.target as HTMLInputElement).value.trim();
    if (value === '') {
      this.checking = false;
      this.isAvailable = false;
      this.claimName.setErrors({
        notUnique: true
      });
      this.claimName.updateValueAndValidity();

    } else {
      this.checking = true;
      this.formOptionSubscription = this._projectService.checkClaimName(this.apiname + this.separator + value)
                                      .subscribe(
                                        (data: boolean) => {
                                          this.checking = false;
                                          this.isAvailable = data;
                                          if (data === false) {
                                            this.claimName.setErrors({
                                              notUnique: true
                                            });
                                          } else {
                                            this.claimName.setErrors({
                                              notUnique: null
                                            });
                                            this.claimName.updateValueAndValidity();
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
      const payload = new ClaimProject(this.form.value);
      this.formSubscription = this._projectService
          .editClaimProject(payload)
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
              console.log('Form Dialog Update Claim Project Observer got a complete notification');
            }
          );
    }
  }

}
