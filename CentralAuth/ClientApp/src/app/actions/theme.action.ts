import { Renderer2 } from "@angular/core";

export class ChangeTheme {
  static readonly type = "[Theme] ChangeTheme";
}

export class ApplyTheme {
  static readonly type = "[Theme] ApplyTheme";
  constructor(public renderer: Renderer2) {}
}
