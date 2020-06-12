import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Unit } from '../models/unit';
import { Observable } from 'rxjs';
import { BranchUnit } from '../models/branch-unit';
import { QueryStringBuilder } from '../utils/query-string-builder';
import { Grid } from '../models/grid';
import { GridResponse } from '../models/grid-response';
import { SimpleGenericService } from './simple-generic.service';

@Injectable({
  providedIn: 'root'
})
export class UnitService extends SimpleGenericService<Unit> {

  constructor(_http: HttpClient) {
    super(_http, 'Unit');
  }
  addBranchUnit(payload: BranchUnit): Observable<any> {
    return this._http.post(`api/Unit/AddBranchUnit`, payload);
  }
  getIdByUser(payload: any): Observable<any> {
    return this._http.get(`api/Unit/GetByIdUser`, payload);
  }
}
