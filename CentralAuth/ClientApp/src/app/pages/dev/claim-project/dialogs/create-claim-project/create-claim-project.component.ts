import { Component, OnInit, Inject } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { ClaimProject } from 'src/app/models/claim-project';
import { Subscription } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomResponse } from 'src/app/models/custom-response';
import { Separator } from 'src/app/models/enums/separator';

@Component({
  selector: 'app-create-claim-project',
  templateUrl: './create-claim-project.component.html',
  styleUrls: ['./create-claim-project.component.scss']
})
export class CreateClaimProjectComponent implements OnInit {
  isAvailable = false;
  checking = false;
  process = false;
  formSubscription: Subscription;
  formOptionSubscription: Subscription;
  apiname = null;
  separator = Separator;
  form = this._fb.group({
    claimName: ['', [Validators.required]],
  });

  constructor(
    private _dialogRef: MatDialogRef<CreateClaimProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private _fb: FormBuilder,
    private _projectService: ProjectService,
  ) {
  }

  ngOnInit(): void {
    this.apiname = this.data;
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
    if (this.form.valid || this.form.errors == null) {
      this.process = true;
      const payload = new ClaimProject(this.form.value);
      payload.projekApiName = this.apiname;
      this.formSubscription = this._projectService
          .addClaimToProject(payload)
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
              console.log('Form Dialog Create Claim Project Observer got a complete notification');
            }
          );
    }
  }

}
