import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Directorate } from '../models/directorate';
import { Grid } from '../models/grid';
import { QueryStringBuilder } from '../utils/query-string-builder';
import { GridResponse } from '../models/grid-response';

@Injectable({
  providedIn: 'root',
})
export class DirectorateService {
  constructor(private _http: HttpClient) {}
  create(payload: Directorate): Observable<any> {
    return this._http.post(`api/Directorate/Create`, payload);
  }
  update(payload: Directorate): Observable<any> {
    return this._http.post(`api/Directorate/Update`, payload);
  }
  delete(payload: string): Observable<any> {
    return this._http.post(`api/Directorate/Delete`, {Kode: payload});
  }
  getAll(): Observable<any> {
    console.log('api/Directorate/GetAll');
    return this._http.get('api/Directorate/GetAll');
  }
  getById(payload: any): Observable<any> {
    return this._http.get(`api/Directorate/GetById`, payload);
  }
  getByIdDepartment(payload: any): Observable<any> {
    return this._http.get(`api/Directorate/GetByIdDepartemen`, payload);
  }
  getIdByUser(payload: any): Observable<any> {
    return this._http.get(`api/Directorate/GetByIdUser`, payload);
  }
  getByFilter(payload: Directorate): Observable<any> {
    const params = QueryStringBuilder.BuildParametersFromSearch<Directorate>(payload);
    return this._http.get(`api/Directorate/GetByFilter?${params}`);
  }
  getByFilterGrid(payload: Grid): Observable<GridResponse<Directorate>> {
    const params = QueryStringBuilder.BuildParametersFromSearch<Grid>(payload);
    return this._http.get<GridResponse<Directorate>>(`api/Directorate/GetByFilterGrid?${params}`);
  }
}
