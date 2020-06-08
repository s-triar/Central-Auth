import { Component, Renderer2, OnInit } from '@angular/core';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(private _themeService: ThemeService, private _renderer: Renderer2) {}
  ngOnInit(): void {
    this._themeService.ApplyTheme(this._renderer);
  }
}
