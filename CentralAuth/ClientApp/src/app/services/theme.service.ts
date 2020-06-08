import { Injectable, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Theme } from '../models/theme';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  currentTheme: BehaviorSubject<Theme> = new BehaviorSubject<Theme>(new Theme());
  currentTheme$: Observable<Theme> = this.currentTheme.asObservable();

  constructor(@Inject(DOCUMENT) private _document: Document) {}

  private GetPreferTheme(): void {
    const savedTheme = localStorage.getItem('prefer-theme');
    this.ChangeState(savedTheme);
  }

  private ChangeState(savedTheme: string): void {
    const theme: Theme = {
      IsDefault: savedTheme === 'dark',
      ThemeName: 'dark-theme'
    };
    this.currentTheme.next(theme);
  }

  private SetPreferTheme(isPreferDarkTheme: boolean): void {
    const themeName = isPreferDarkTheme ? 'dark' : 'light';
    localStorage.setItem('prefer-theme', themeName);
    this.ChangeState(themeName);
  }

  ToggleTheme(renderer: Renderer2): void {
    this.SetPreferTheme(!this.currentTheme.getValue().IsDefault);
    this.ApplyTheme(renderer);
  }

  ApplyTheme(renderer: Renderer2): void {
    this.GetPreferTheme();
    if (this.currentTheme.getValue().IsDefault === false) {
      renderer.addClass(this._document.body, this.currentTheme.getValue().ThemeName);
    } else {
      renderer.removeClass(this._document.body, this.currentTheme.getValue().ThemeName);
    }
  }
}
