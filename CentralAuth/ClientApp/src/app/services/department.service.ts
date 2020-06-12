import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/department';
import { QueryStringBuilder } from '../utils/query-string-builder';
import { GridResponse } from '../models/grid-response';
import { Grid } from '../models/grid';
import { SimpleGenericService } from './simple-generic.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService extends SimpleGenericService<Department> {

  constructor(_http: HttpClient) {
    super(_http, 'Department');
  }
  getByIdSubDepartment(payload: any): Observable<any> {
    return this._http.get(`api/Department/GetByIdSubDepartemen`, payload);
  }
  getIdByUser(payload: any): Observable<any> {
    return this._http.get(`api/Department/GetByIdUser`, payload);
  }
}
