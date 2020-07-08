import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-card-info',
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.scss']
})
export class CardInfoComponent implements OnInit {
  @Input()
  Icon: string;
  @Input()
  Title: string;
  @Input()
  Number: number;
  @Input()
  Url: string;
  constructor(private _router: Router, private _activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

  }

  goTo(url)  {
    if (url !== '' && url !== null) {
      this._router.navigate(['../' + url], {relativeTo: this._activatedRoute});
    }
  }

}
