import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login } from '../models/auth';
import { User } from '../models/user';
import { Observable, BehaviorSubject } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  user: BehaviorSubject<User>;
  user_roles: BehaviorSubject<string[]>;
  user$: Observable<User>;
  user_roles$: Observable<string[]>;

  constructor(private _http: HttpClient, private _tokenService: TokenService) {
    this.user = new BehaviorSubject<User>(null);
    this.user_roles = new BehaviorSubject<string[]>([]);
    this.user$ = this.user.asObservable();
    this.user_roles$ = this.user_roles.asObservable();
  }

  login(payload: Login): Observable<any> {
    return this._http.post<any>('api/Auth/login', payload);
  }

  logout(): Observable<any> {
    return this._http.post('api/Auth/logout', {});
  }

  setLoggedUser() {
    const u = this._tokenService.getUserInfo();
    const userDataString = u['http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata'];
    const userData = new User(JSON.parse(userDataString));
    const rolesData = u['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    this.user.next(userData);
    this.user_roles.next(rolesData);
  }
}
