import { Login as LoginModel } from "../models/auth";

export class Login {
  static readonly type = "[Auth] Login";
  constructor(public payload: LoginModel) {}
}

export class Logout {
  static readonly type = "[Auth] Logout";
}
