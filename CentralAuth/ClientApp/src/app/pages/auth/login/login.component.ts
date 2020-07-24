import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Login } from 'src/app/models/auth';
import { Subscription } from 'rxjs';
import { CustomResponse } from 'src/app/models/custom-response';
import { HttpErrorResponse } from '@angular/common/http';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  process = false;
  hide = true;
  form = this.fb.group({
    nik: ['', [Validators.required, Validators.pattern('[0-9]+')]],
    password: ['', Validators.required],
  });
  formSubscription: Subscription;
  constructor(private fb: FormBuilder, private _authService: AuthService, private _tokenService: TokenService, private _router: Router) {}
  ngOnInit(): void {}
  get nik() {
    return this.form.get('nik');
  }
  get password() {
    return this.form.get('password');
  }
  onSubmitClick() {
    this.formSubscription = this._authService
                                .login(new Login(this.form.value))
                                .subscribe(
                                  (x: CustomResponse<any>) => {
                                    this._tokenService.saveToken(x.data);
                                    this._authService.setLoggedUser();
                                    this.formSubscription.unsubscribe();
                                    // location.reload();
                                    this._router.navigateByUrl('/dashboard', {replaceUrl: true});
                                  },
                                  (err: HttpErrorResponse) => {
                                    this.formSubscription.unsubscribe();
                                    this.process = false;
                                  },
                                  () => {
                                    console.log('Form Login Observer got a complete notification');
                                  }
                                )
                                ;
  }
}
