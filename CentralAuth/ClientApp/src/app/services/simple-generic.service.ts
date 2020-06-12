import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Department } from '../models/department';
import { QueryStringBuilder } from '../utils/query-string-builder';
import { GridResponse } from '../models/grid-response';
import { Grid } from '../models/grid';
import { HttpClient } from '@angular/common/http';

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
  delete(payload: string): Observable<any> {
    return this._http.post(`api/${this.controller}/Delete`, {Kode: payload});
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
  getByFilterGrid(payload: Grid): Observable<GridResponse<T>> {
    const params = QueryStringBuilder.BuildParametersFromSearch<Grid>(payload);
    return this._http.get<GridResponse<T>>(`api/${this.controller}/GetByFilterGrid?${params}`);
  }
}
