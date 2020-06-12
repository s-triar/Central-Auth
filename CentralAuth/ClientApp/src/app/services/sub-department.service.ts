import { Injectable } from '@angular/core';
import { SubDepartment } from '../models/sub-department';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QueryStringBuilder } from '../utils/query-string-builder';
import { Grid } from '../models/grid';
import { GridResponse } from '../models/grid-response';
import { SimpleGenericService } from './simple-generic.service';

@Injectable({
  providedIn: 'root'
})
export class SubDepartmentService extends SimpleGenericService<SubDepartment> {

  constructor(_http: HttpClient) {
    super(_http, 'SubDepartment');
  }
  getIdByUser(payload: any): Observable<any> {
    return this._http.get(`api/SubDepartment/GetByIdUser`, payload);
  }
}
