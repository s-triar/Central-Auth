import { Injectable } from '@angular/core';
import { UserAddRole } from '../models/auth/user-add-role';
import { SimpleGenericService } from './simple-generic.service';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRegister } from '../models/auth/user-register';
import { UserUpdate } from '../models/auth/user-update';

@Injectable({
  providedIn: 'root'
})
export class UserService extends SimpleGenericService<User> {

  constructor(_http: HttpClient) {
    super(_http, 'User');
  }
  addClaimsToUser(payload: UserAddRole): Observable<any> {
    return this._http.post(`api/User/AddClaimsToUser`, payload);
  }
  addRolesToUser(payload: UserAddRole): Observable<any> {
    return this._http.post(`api/User/AddRolesToUser`, payload);
  }
  registerAccount(payload: UserRegister): Observable<any> {
    return this._http.post(`api/User/RegisterAccount`, payload);
  }
  updateAccount(payload: UserUpdate): Observable<any> {
    return this._http.post(`api/User/UpdateAccount`, payload);
  }
  deleteAccount(payload: User): Observable<any> {
    return this._http.post(`api/User/DeleteAccount`, payload);
  }
}
