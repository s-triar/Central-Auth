import { Component, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { CustomResponse } from 'src/app/models/custom-response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnInit {

  process = false;
  formSubscription: Subscription;
  form = this._fb.group({
    nik: [this.data.nik, [Validators.required]],
    nama: [this.data.nama, Validators.required],
  });
  constructor(
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<DeleteUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private _userService: UserService,
  ) { }

  ngOnInit(): void {
  }
  get nik() {
    return this.form.get('nik');
  }
  get nama() {
    return this.form.get('nama');
  }
  onNoClick(): void {
    this._dialogRef.close();
  }

  onSubmitClick() {
    if (this.form.valid) {
      this.process = true;
      this.formSubscription = this._userService
          .deleteAccount(new User(this.form.value))
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
              console.log('Form Dialog Delete User Observer got a complete notification');
            }
          );
    }
  }
}
