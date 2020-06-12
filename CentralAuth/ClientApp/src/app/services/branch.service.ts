import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Branch } from '../models/branch';
import { Observable } from 'rxjs';
import { QueryStringBuilder } from '../utils/query-string-builder';
import { Grid } from '../models/grid';
import { GridResponse } from '../models/grid-response';
import { BranchUnit } from '../models/branch-unit';
import { SimpleGenericService } from './simple-generic.service';

@Injectable({
  providedIn: 'root'
})
export class BranchService extends SimpleGenericService<Branch> {

  constructor(_http: HttpClient) {
    super(_http, 'Branch');
  }
  addBranchUnit(payload: BranchUnit): Observable<any> {
    return this._http.post(`api/${this.controller}/AddBranchUnit`, payload);
  }
  getIdByUser(payload: any): Observable<any> {
    return this._http.get(`api/${this.controller}/GetByIdUser`, payload);
  }
}
