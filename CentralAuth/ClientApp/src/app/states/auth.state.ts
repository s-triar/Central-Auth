import { State, Selector, Action, StateContext } from "@ngxs/store";
import { User } from "../models/user";
import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { Logout, Login } from "../actions/auth.action";
import { AuthService } from "../services/auth.service";

@State<User>({
  name: "auth",
  defaults: {
    Nik: null,
    Name: null,
    Email: null,
    Phone: null,
    Token: null,
    PhotoUrl: null,
  },
})
@Injectable()
export class AuthState {
  @Selector()
  static token(state: User): string | null {
    return state.Token;
  }

  @Selector()
  static isAuthenticated(state: User): boolean {
    return !!state.Token;
  }

  constructor(private authService: AuthService) {}

  @Action(Login)
  login({ patchState }: StateContext<User>, { payload }: Login) {
    return this.authService.login(payload).pipe(
      tap((result) => {
        patchState(new User(result));
      })
    );
  }

  @Action(Logout)
  logout({ getState, setState }: StateContext<User>) {
    const state = getState();
    return this.authService.logout(state.Token).pipe(
      tap(() => {
        setState(new User());
      })
    );
  }
}
