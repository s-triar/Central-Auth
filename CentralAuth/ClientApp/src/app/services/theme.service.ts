import { Injectable, Inject, Renderer2 } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Theme } from "../models/theme";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  constructor(@Inject(DOCUMENT) private _document: Document) {}

  ApplyTheme(renderer: Renderer2, data: Theme) {
    if (data.IsDefault == false) {
      renderer.addClass(this._document.body, data.ThemeName);
    } else {
      renderer.removeClass(this._document.body, data.ThemeName);
    }
  }
}
