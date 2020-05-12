import { Component, Renderer2, OnInit } from "@angular/core";
import { Store } from "@ngxs/store";
import { ApplyTheme } from "./actions/theme.action";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "app";
  constructor(private _store: Store, private _renderer: Renderer2) {}
  ngOnInit(): void {
    this._store.dispatch(new ApplyTheme(this._renderer));
  }
}
