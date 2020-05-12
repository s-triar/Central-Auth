import { State, Selector, Action, StateContext } from "@ngxs/store";
import { Theme } from "../models/theme";
import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { ChangeTheme, ApplyTheme } from "../actions/theme.action";
import { ThemeService } from "../services/theme.service";

@State<Theme>({
  name: "theme",
  defaults: {
    IsDefault: true,
    ThemeName: null,
  },
})
@Injectable()
export class ThemeState {
  @Selector()
  static isDefault(state: Theme): boolean {
    return state.IsDefault;
  }

  @Selector()
  static themName(state: Theme): string {
    return state.ThemeName;
  }

  constructor(private _themeService: ThemeService) {}

  @Action(ChangeTheme)
  change({ getState, patchState, setState }: StateContext<Theme>) {
    if (getState().IsDefault == true) {
      const theme: Theme = {
        IsDefault: false,
        ThemeName: "dark-theme",
      };
      patchState(theme);
    } else {
      const theme: Theme = {
        IsDefault: true,
        ThemeName: "dark-theme",
      };
      patchState(theme);
    }
  }

  @Action(ApplyTheme)
  apply({ getState }: StateContext<Theme>, { renderer }: ApplyTheme) {
    const state = getState();
    this._themeService.ApplyTheme(renderer, state);
  }
}
