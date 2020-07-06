import { Component, OnInit, Inject } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Role } from 'src/app/models/role';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { UserAddRole } from 'src/app/models/auth/user-add-role';
import { CustomResponse } from 'src/app/models/custom-response';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectIdentityVM } from 'src/app/models/project-identity-vm';
import { ClaimProject } from 'src/app/models/claim-project';
import { Separator } from 'src/app/models/enums/separator';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-claim-role-project',
  templateUrl: './claim-role-project.component.html',
  styleUrls: ['./claim-role-project.component.scss']
})
export class ClaimRoleProjectComponent implements OnInit {
  claimChoosen: ClaimProject;
  process = false;
  separator = Separator;
  apiname = null;
  claimOptions: ClaimProject[] = [];
  rolesClaims: ClaimProject[] = [];
  form = this._fb.group({
    id: [this.data.id, [Validators.required]],
    name: [this.data.name, [Validators.required]],
    projectApiName: [this.data.projectApiName, Validators.required],
  });
  constructor(
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<ClaimRoleProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Role,
    private _projectService: ProjectService,
  ) { }

  ngOnInit(): void {
    this.apiname = this.data.projectApiName;
    this.getClaimOfRole();
  }
  get id() {
    return this.form.get('id');
  }
  get name() {
    return this.form.get('name');
  }
  get projectApiName() {
    return this.form.get('projectApiName');
  }
  getClaimOfRole() {
    this._projectService.getClaimOfRole(this.data.projectApiName, this.data.id)
                        .pipe(
                          map((x: ClaimProject[]) => {
                            return x.map(y => {
                              const t = new ClaimProject();
                              t.id = y.id;
                              t.claimName = y.claimName.split(Separator)[1];
                              t.projek = y.projek;
                              t.projekApiName = y.projekApiName;
                              return t;
                            });
                          })
                        )
                        .subscribe(x => this.rolesClaims = x);
  }
  onNoClick(): void {
    this._dialogRef.close();
  }
  onSearch(event) {
    let value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (value === undefined || value === null) {
      value = '';
    }
    this._projectService.getAvailableClaimForRole(this.data.projectApiName, this.data.id, value)
                        .pipe(
                          map((x: ClaimProject[]) => {
                            return x.map(y => {
                              const t = new ClaimProject();
                              t.id = y.id;
                              t.claimName = y.claimName.split(Separator)[1];
                              t.projek = y.projek;
                              t.projekApiName = y.projekApiName;
                              return t;
                            });
                          })
                        )
                        .subscribe(x => this.claimOptions = x);
  }
  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const data = event.option.value;
    this.claimChoosen = data;
  }
  displayFn(data: ClaimProject) {
    return data && data.claimName ? data.claimName : '';
  }
  onAdd() {
    if (this.claimChoosen !== null ) {
      this.process = true;
      const payload = new ProjectIdentityVM();
      payload.idRole = this.data.id;
      payload.idProjectClaim = this.claimChoosen.id;
      const reqSub = this._projectService
          .addClaimToRoleProject(payload)
          .subscribe(
            (x: CustomResponse<any>) => {
              this.claimChoosen = null;
              this.getClaimOfRole();
              reqSub.unsubscribe();
              this.process = false;
            },
            (err: HttpErrorResponse) => {
              reqSub.unsubscribe();
              this.process = false;
            },
            () => {
              console.log('Form Dialog Add Claim for Role Project Observer got a complete notification');
            }
          );
    }
  }
  onRemove(cp: ClaimProject) {
    this.process = true;
    const payload = new ProjectIdentityVM();
    payload.idRole = this.data.id;
    payload.idProjectClaim = cp.id;
    const reqSub = this._projectService
                       .removeClaimFromRoleProject(payload)
                       .subscribe(
                          (x: CustomResponse<any>) => {
                            this.getClaimOfRole();
                            this.process = false;
                            reqSub.unsubscribe();
                          },
                          (err: HttpErrorResponse) => {
                            reqSub.unsubscribe();
                            this.process = false;
                          },
                          () => {
                            console.log('Form Dialog Delete Claim for Role Project Observer got a complete notification');
                          }
                        );
  }
}
