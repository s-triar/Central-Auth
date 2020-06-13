import { Component, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { CustomResponse } from 'src/app/models/custom-response';
import { HttpErrorResponse } from '@angular/common/http';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { UserAddRole } from 'src/app/models/auth/user-add-role';

@Component({
  selector: 'app-role-user',
  templateUrl: './role-user.component.html',
  styleUrls: ['./role-user.component.scss']
})
export class RoleUserComponent implements OnInit {
  roleChoosen = '';
  process = false;
  roleOptions: string[];
  userRoles = [];
  form = this._fb.group({
    nik: [this.data.nik, [Validators.required]],
    nama: [this.data.nama, Validators.required],
  });
  constructor(
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<RoleUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private _userService: UserService,
  ) { }

  ngOnInit(): void {
    this.getUserRole();
  }
  get nik() {
    return this.form.get('nik');
  }
  get nama() {
    return this.form.get('nama');
  }
  getUserRole() {
    this._userService.getUserRole(this.data.nik).subscribe(x => this.userRoles = x);
  }
  onNoClick(): void {
    this._dialogRef.close();
  }
  onSearch(event) {
    let value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (value === undefined || value === null) {
      value = '';
    }
    this._userService.getAvailableRole(this.data.nik, value).subscribe(x => this.roleOptions = x);
  }
  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const data = event.option.value;
    this.roleChoosen = data;
  }
  onAdd() {
    if (this.roleChoosen !== null && this.roleChoosen !== '') {
      this.process = true;
      const payload = new UserAddRole();
      payload.nik = this.data.nik;
      payload.roles = [this.roleChoosen];
      const reqSub = this._userService
          .addRolesToUser(payload)
          .subscribe(
            (x: CustomResponse<any>) => {
              this.roleChoosen = '';
              this.getUserRole();
              reqSub.unsubscribe();
              this.process = false;
            },
            (err: HttpErrorResponse) => {
              reqSub.unsubscribe();
              this.process = false;
            },
            () => {
              console.log('Form Dialog Add Role User Observer got a complete notification');
            }
          );
    }
  }
  onRemove(role: string) {
    this.process = true;
    const payload = new UserAddRole();
    payload.nik = this.data.nik;
    payload.roles = [role];
    const reqSub = this._userService
                       .removeRoleFromUser(payload)
                       .subscribe(
                          (x: CustomResponse<any>) => {
                            this.getUserRole();
                            this.process = false;
                            reqSub.unsubscribe();
                          },
                          (err: HttpErrorResponse) => {
                            reqSub.unsubscribe();
                            this.process = false;
                          },
                          () => {
                            console.log('Form Dialog Delete Role User Observer got a complete notification');
                          }
                        );
  }

}
