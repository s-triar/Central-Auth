import { Component, OnInit, ViewChild, Input } from "@angular/core";

@Component({
  selector: "app-card-user-login",
  templateUrl: "./card-user-login.component.html",
  styleUrls: ["./card-user-login.component.scss"],
})
export class CardUserLoginComponent implements OnInit {
  title = "All User Logged In";
  type = "LineChart";
  data = [
    ["January", 36],
    ["February", 52],
    ["March", 31],
    ["April", 33],
    ["May", 63],
    ["June", 42],
    ["July", 42],
    ["August", 54],
    ["September", 74],
    ["October", 24],
    ["November", 54],
    ["December", 44],
  ];
  columnNames = ["Months", "User Logged In"];
  options = {
    hAxis: {
      title: "Months",
    },
    vAxis: {
      title: "User Logged In",
    },
    seriesType: "line",
    backgroundColor: "#FFFFFF",
  };
  // width = 100;
  // height = 100;
  constructor() {}

  ngOnInit(): void {}
}
