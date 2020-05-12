import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-card-project-list",
  templateUrl: "./card-project-list.component.html",
  styleUrls: ["./card-project-list.component.scss"],
})
export class CardProjectListComponent implements OnInit {
  items = [];

  constructor() {}

  ngOnInit(): void {
    for (let index = 0; index < 16; index++) {
      this.items.push(index);
    }
  }
}
