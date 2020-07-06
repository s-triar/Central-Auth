import { Component, OnInit, Inject } from '@angular/core';
import { UserProject } from 'src/app/models/user-project';
import { ClaimProject } from 'src/app/models/claim-project';
import { Separator } from 'src/app/models/enums/separator';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from 'src/app/services/project.service';
import { map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ProjectIdentityVM } from 'src/app/models/project-identity-vm';
import { CustomResponse } from 'src/app/models/custom-response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-claim-user-project',
  templateUrl: './claim-user-project.component.html',
  styleUrls: ['./claim-user-project.component.scss']
})
export class ClaimUserProjectComponent implements OnInit {
  apiname = null;
  claimChoosen: ClaimProject;
  process = false;
  separator = Separator;
  claimOptions: ClaimProject[] = [];
  rolesClaims: ClaimProject[] = [];
  form = this._fb.group({
    nik: [this.data.pengguna.nik, [Validators.required]],
    nama: [this.data.pengguna.nama, [Validators.required]],
  });
  constructor(
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<ClaimUserProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserProject,
    private _projectService: ProjectService,
  ) { }

  ngOnInit(): void {
    this.apiname = this.data.projekApiName;
    this.getClaimOfUser();
  }
  get nama() {
    return this.form.get('nama');
  }
  get nik() {
    return this.form.get('nik');
  }
  getClaimOfUser() {
    this._projectService.getClaimOfUser(this.data.projekApiName, this.data.pengguna.nik)
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
    this._projectService.getAvailableClaimForUser(this.data.projekApiName, this.data.pengguna.nik, value)
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
      payload.nik = this.data.pengguna.nik;
      payload.idProjectClaim = this.claimChoosen.id;
      const reqSub = this._projectService
          .addClaimToUserProject(payload)
          .subscribe(
            (x: CustomResponse<any>) => {
              this.claimChoosen = null;
              this.getClaimOfUser();
              reqSub.unsubscribe();
              this.process = false;
            },
            (err: HttpErrorResponse) => {
              reqSub.unsubscribe();
              this.process = false;
            },
            () => {
              console.log('Form Dialog Add Claim for User Project Observer got a complete notification');
            }
          );
    }
  }
  onRemove(cp: ClaimProject) {
    this.process = true;
    const payload = new ProjectIdentityVM();
    payload.nik = this.data.pengguna.nik;
    payload.idProjectClaim = cp.id;
    const reqSub = this._projectService
                       .removeClaimFromUserProject(payload)
                       .subscribe(
                          (x: CustomResponse<any>) => {
                            this.getClaimOfUser();
                            this.process = false;
                            reqSub.unsubscribe();
                          },
                          (err: HttpErrorResponse) => {
                            reqSub.unsubscribe();
                            this.process = false;
                          },
                          () => {
                            console.log('Form Dialog Delete Claim for User Project Observer got a complete notification');
                          }
                        );
  }

}
