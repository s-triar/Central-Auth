import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { User } from '../models/user';
import { Theme } from '../models/theme';
import { ThemeService } from '../services/theme.service';
import { AuthService } from '../services/auth.service';
import { CustomResponse } from '../models/custom-response';
import { TokenService } from '../services/token.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent implements OnInit, OnDestroy {
  showMenuMaster = false;
  theme$: Observable<Theme>;
  formSubscription: Subscription;
  user$: Observable<User>;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private _renderer: Renderer2,
    private _themeService: ThemeService,
    private _authService: AuthService,
    private _tokenService: TokenService,
    private _router: Router
  ) {}
  ngOnDestroy(): void {}

  ngOnInit() {
    this.theme$ = this._themeService.currentTheme$;
    this.user$ = this._authService.user$;
  }

  ToggleTheme() {
    this._themeService.ToggleTheme(this._renderer);
  }

  logout() {
    this.formSubscription = this._authService
                                .logout()
                                .subscribe(
                                  (x: CustomResponse<any>) => {
                                    this._tokenService.removeToken();
                                    this._authService.setLoggedUser();
                                    this.formSubscription.unsubscribe();
                                    this._router.navigate(['/login'], {replaceUrl: true});
                                  },
                                  (err: HttpErrorResponse) => {
                                    this.formSubscription.unsubscribe();
                                  },
                                  () => {
                                    console.log('Form Logout Observer got a complete notification');
                                  }
                                )
                                ;
  }
  toggleMenuMaster() {
    this.showMenuMaster = !this.showMenuMaster;
  }
}
