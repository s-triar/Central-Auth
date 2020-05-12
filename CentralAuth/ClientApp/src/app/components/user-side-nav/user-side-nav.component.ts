import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-user-side-nav",
  templateUrl: "./user-side-nav.component.html",
  styleUrls: ["./user-side-nav.component.scss"],
})
export class UserSideNavComponent implements OnInit {
  @Input()
  Url: string;
  @Input()
  Name: string;
  @Input()
  Nik: string;

  constructor() {}

  ngOnInit(): void {
    console.log(this.Url);
  }
}
