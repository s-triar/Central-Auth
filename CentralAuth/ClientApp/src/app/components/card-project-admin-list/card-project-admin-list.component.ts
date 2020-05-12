import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-card-project-admin-list",
  templateUrl: "./card-project-admin-list.component.html",
  styleUrls: ["./card-project-admin-list.component.scss"],
})
export class CardProjectAdminListComponent implements OnInit {
  items = [];

  constructor() {}

  ngOnInit(): void {
    for (let index = 0; index < 16; index++) {
      this.items.push(index);
    }
  }
}
