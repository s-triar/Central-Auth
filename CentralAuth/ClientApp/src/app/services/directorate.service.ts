import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Directorate } from '../models/directorate';
import { Grid } from '../models/grid';
import { QueryStringBuilder } from '../utils/query-string-builder';
import { GridResponse } from '../models/grid-response';
import { SimpleGenericService } from './simple-generic.service';

@Injectable({
  providedIn: 'root',
})
export class DirectorateService extends SimpleGenericService<Directorate> {
  constructor(_http: HttpClient) {
    super(_http, 'Directorate');
  }
  getByIdDepartment(payload: any): Observable<any> {
    return this._http.get(`api/Directorate/GetByIdDepartemen`, payload);
  }
  getIdByUser(payload: any): Observable<any> {
    return this._http.get(`api/Directorate/GetByIdUser`, payload);
  }
}
