import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { User } from '../models/user';
import { Theme } from '../models/theme';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent implements OnInit, OnDestroy {
  theme$: Observable<Theme>;



  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private _renderer: Renderer2,
    private _themeService: ThemeService
  ) {}
  ngOnDestroy(): void {}

  ngOnInit() {
    this.theme$ = this._themeService.currentTheme$;
  }

  ToggleTheme() {
    this._themeService.ToggleTheme(this._renderer);
  }
}
