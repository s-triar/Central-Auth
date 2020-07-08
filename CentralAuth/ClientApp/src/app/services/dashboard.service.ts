import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BranchUnit } from '../models/branch-unit';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private _http: HttpClient) {
  }
  getDashboardDataUser(payload: string): Observable<any> {
    let header: HttpHeaders = new HttpHeaders();
    header = header.set('reqnoloadingdialog', 'true');
    return this._http.get(`api/Dashboard/GetDataDashboardUser`, {headers: header, params: {'Nik': payload}});
  }
  getDashboardDataDeveloper(payload: string): Observable<any> {
    let header: HttpHeaders = new HttpHeaders();
    header = header.set('reqnoloadingdialog', 'true');
    return this._http.get(`api/Dashboard/GetDataDashboardDev`, {headers: header, params: {'Nik': payload}});
  }
  getDashboardDataAdmin(): Observable<any> {
    let header: HttpHeaders = new HttpHeaders();
    header = header.set('reqnoloadingdialog', 'true');
    return this._http.get(`api/Dashboard/GetDataDashboardAdmin`, {headers: header});
  }
}
