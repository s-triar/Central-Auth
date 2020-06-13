import { Component, Renderer2, OnInit } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(private _themeService: ThemeService, private _renderer: Renderer2, private _authService: AuthService) {}
  ngOnInit(): void {
    this._themeService.ApplyTheme(this._renderer);
    this._authService.setLoggedUser();
  }
}
