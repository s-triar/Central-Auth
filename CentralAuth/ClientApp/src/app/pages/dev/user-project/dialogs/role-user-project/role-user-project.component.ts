import { Component, OnInit, Inject } from '@angular/core';
import { Role } from 'src/app/models/role';
import { Separator } from 'src/app/models/enums/separator';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserProject } from 'src/app/models/user-project';
import { ProjectService } from 'src/app/services/project.service';
import { map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ProjectIdentityVM } from 'src/app/models/project-identity-vm';
import { CustomResponse } from 'src/app/models/custom-response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-role-user-project',
  templateUrl: './role-user-project.component.html',
  styleUrls: ['./role-user-project.component.scss']
})
export class RoleUserProjectComponent implements OnInit {
  apiname = null;
  claimChoosen: Role;
  process = false;
  separator = Separator;
  claimOptions: Role[] = [];
  rolesClaims: Role[] = [];
  form = this._fb.group({
    nik: [this.data.pengguna.nik, [Validators.required]],
    nama: [this.data.pengguna.nama, [Validators.required]],
  });
  constructor(
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<RoleUserProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserProject,
    private _projectService: ProjectService,
  ) { }

  ngOnInit(): void {
    this.apiname = this.data.projekApiName;
    this.getRoleOfUser();
  }
  get nama() {
    return this.form.get('nama');
  }
  get nik() {
    return this.form.get('nik');
  }
  getRoleOfUser() {
    this._projectService.getRoleOfUser(this.data.projekApiName, this.data.pengguna.nik)
                        .pipe(
                          map((x: Role[]) => {
                            return x.map(y => {
                              const t = new Role();
                              t.id = y.id;
                              t.name = y.name.split(Separator)[1];
                              t.normalizedName = y.normalizedName;
                              t.projectApiName = y.projectApiName;
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
    this._projectService.getAvailableRoleForUser(this.data.projekApiName, this.data.pengguna.nik, value)
                        .pipe(
                          map((x: Role[]) => {
                            return x.map(y => {
                              const t = new Role();
                              t.id = y.id;
                              t.name = y.name.split(Separator)[1];
                              t.normalizedName = y.normalizedName;
                              t.projectApiName = y.projectApiName;
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
  displayFn(data: Role) {
    return data && data.name ? data.name : '';
  }
  onAdd() {
    if (this.claimChoosen !== null ) {
      this.process = true;
      const payload = new ProjectIdentityVM();
      payload.nik = this.data.pengguna.nik;
      payload.idRole = this.claimChoosen.id;
      const reqSub = this._projectService
          .addRoleToUserProject(payload)
          .subscribe(
            (x: CustomResponse<any>) => {
              this.claimChoosen = null;
              this.getRoleOfUser();
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
  onRemove(cp: Role) {
    this.process = true;
    const payload = new ProjectIdentityVM();
    payload.nik = this.data.pengguna.nik;
    payload.idRole = cp.id;
    const reqSub = this._projectService
                       .removeRoleFromUserProject(payload)
                       .subscribe(
                          (x: CustomResponse<any>) => {
                            this.getRoleOfUser();
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
