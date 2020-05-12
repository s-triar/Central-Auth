import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Login } from "../models/auth";
import { User } from "../models/user";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private _http: HttpClient) {}

  login(payload: Login): Observable<User> {
    return this._http.post<User>("http://localhost:42532/login", payload);
  }

  logout(token: string): Observable<any> {
    return this._http.post("http://localhost:3522/logout", { Token: token });
  }
}
