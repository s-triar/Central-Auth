import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Department } from '../models/department';
import { QueryStringBuilder } from '../utils/query-string-builder';
import { GridResponse } from '../models/grid-response';
import { Grid } from '../models/grid';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SimpleGenericService<T> {

  constructor(protected _http: HttpClient, protected controller: string) {}
  create(payload: T): Observable<any> {
    return this._http.post(`api/${this.controller}/Create`, payload);
  }
  update(payload: T): Observable<any> {
    return this._http.post(`api/${this.controller}/Update`, payload);
  }
  delete(payload: T): Observable<any> {
    return this._http.post(`api/${this.controller}/Delete`, payload);
  }
  getAll(): Observable<any> {
    return this._http.get('api/${this.controller}/GetAll');
  }
  getById(payload: any): Observable<any> {
    return this._http.get(`api/${this.controller}/GetById`, payload);
  }

  getByFilter(payload: T): Observable<any> {
    const params = QueryStringBuilder.BuildParametersFromSearch<T>(payload);
    return this._http.get(`api/${this.controller}/GetByFilter?${params}`);
  }
  getByFilterGrid(payload: Grid, isNoLoading: boolean = false): Observable<GridResponse<T>> {
    const params = QueryStringBuilder.BuildParametersFromSearch<Grid>(payload);
    let header: HttpHeaders = new HttpHeaders();
    if (isNoLoading) {
      header = header.set('reqnoloadingdialog', 'true');
    }
    return this._http.get<GridResponse<T>>(`api/${this.controller}/GetByFilterGrid?${params}`, {headers: header});

  }
}
