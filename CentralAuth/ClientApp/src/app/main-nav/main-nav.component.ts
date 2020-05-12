import { Component, OnInit, Renderer2, OnDestroy } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { User } from "../models/user";
import { Store, Select } from "@ngxs/store";
import { ChangeTheme, ApplyTheme } from "../actions/theme.action";
import { state } from "@angular/animations";
import { ThemeState } from "../states/theme.state";
import { Theme } from "../models/theme";

@Component({
  selector: "app-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.scss"],
})
export class MainNavComponent implements OnInit, OnDestroy {
  // @Select(ThemeState.isDefault) theme$: Observable<boolean>;
  @Select((state) => state.theme) theme$;

  user: User = {
    Nik: "2015169765",
    Email: "sulaimantriarjo@indomaret.co.id",
    Name: "Sulaiman Triarjo",
    Phone: "085755519123",
    PhotoUrl: "assets/defaults/logo_small_icon_only.png",
    Token: "",
  };

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private _renderer: Renderer2,
    private _store: Store
  ) {}
  ngOnDestroy(): void {}

  ngOnInit() {}

  ToggleTheme() {
    this._store.dispatch([new ChangeTheme(), new ApplyTheme(this._renderer)]);
  }
}
