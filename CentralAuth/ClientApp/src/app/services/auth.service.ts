import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login } from '../models/auth';
import { User } from '../models/user';
import { Observable, BehaviorSubject } from 'rxjs';
import { TokenService } from './token.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  user: BehaviorSubject<User> = new BehaviorSubject<User>(new User());
  user_roles: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  user$: Observable<User> = this.user.asObservable();
  user_roles$: Observable<string[]> = this.user_roles.asObservable();

  constructor(private _http: HttpClient, private _tokenService: TokenService, private _userService: UserService) {
  }

  login(payload: Login): Observable<any> {
    return this._http.post<any>('api/Auth/login', payload);
  }

  logout(): Observable<any> {
    return this._http.post('api/Auth/logout', {});
  }

  setLoggedUser() {

    const u = this._tokenService.getUserInfo();
    if (u) {
      const username = u['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'];
      this._userService.getUserDetail(username).subscribe(
        x => this.user.next(x)
      );
      const rolesData = u['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      this.user_roles.next(rolesData);
    } else {
      this.user.next(new User());
      this.user_roles.next([]);
    }
  }
}
