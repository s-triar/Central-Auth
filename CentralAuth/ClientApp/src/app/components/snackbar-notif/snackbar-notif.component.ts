import { Component, OnInit, Input, Inject } from '@angular/core';
import { ResponseContext } from 'src/app/models/response-context';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar-notif',
  templateUrl: './snackbar-notif.component.html',
  styleUrls: ['./snackbar-notif.component.scss']
})
export class SnackbarNotifComponent implements OnInit {


  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: ResponseContext) { }

  ngOnInit(): void {
  }

}
