import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Project } from '../models/project';
import { SimpleGenericService } from './simple-generic.service';
import { Observable } from 'rxjs';
import { GridResponse } from '../models/grid-response';
import { QueryStringBuilder } from '../utils/query-string-builder';
import { Grid } from '../models/grid';
import { User } from '../models/user';
import { URLSearchParams } from 'url';
import { CustomResponse } from '../models/custom-response';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends SimpleGenericService<Project> {

  constructor(_http: HttpClient) {
    super(_http, 'Project');
  }

  checkApiName(payload: string): Observable<boolean> {
    let header: HttpHeaders = new HttpHeaders();
    header = header.set('reqnoloadingdialog', 'true');
    return this._http.get<boolean>(`api/Project/CheckApiName`, {headers: header, params: {'ApiName': payload}});
  }

  getListUserByFilterGrid(payload: Grid, apiName: string, isNoLoading: boolean = false): Observable<any> {
    const params = QueryStringBuilder.BuildParametersFromSearch<Grid>(payload);
    let header: HttpHeaders = new HttpHeaders();
    if (isNoLoading) {
      header = header.set('reqnoloadingdialog', 'true');
    }
    params.set('apiName', apiName);
    return this._http.get<GridResponse<User>>(`api/Project/GetListUserByFilterGrid?${params}`, {headers: header});
  }

  getProjectDashboard(payload: string): Observable<any> {
    let header: HttpHeaders = new HttpHeaders();
    header = header.set('reqnonotify', 'true');
    return this._http.get<CustomResponse<any>>(`api/Project/GetProjectDashboard`, {headers: header, params : {'ApiName': payload}});
  }

  


}
