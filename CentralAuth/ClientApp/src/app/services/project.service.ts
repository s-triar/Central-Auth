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
import { ProjectToProject } from '../models/project-to-project';
import { Role } from '../models/role';
import { ClaimProject } from '../models/claim-project';
import { ProjectIdentityVM } from '../models/project-identity-vm';
import { UserProject } from '../models/user-project';

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
  checkRoleName(payload: string): Observable<boolean> {
    let header: HttpHeaders = new HttpHeaders();
    header = header.set('reqnoloadingdialog', 'true');
    return this._http.get<boolean>(`api/Project/CheckRoleName`, {headers: header, params: {'RoleName': payload}});
  }
  checkClaimName(payload: string): Observable<boolean> {
    let header: HttpHeaders = new HttpHeaders();
    header = header.set('reqnoloadingdialog', 'true');
    return this._http.get<boolean>(`api/Project/CheckClaimName`, {headers: header, params: {'ClaimName': payload}});
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
  getAvailableUserProject(payload: Grid, apiName: string, isNoLoading: boolean = false): Observable<any> {
    const params = QueryStringBuilder.BuildParametersFromSearch<Grid>(payload);
    let header: HttpHeaders = new HttpHeaders();
    if (isNoLoading) {
      header = header.set('reqnoloadingdialog', 'true');
    }
    params.set('apiName', apiName);
    return this._http.get<GridResponse<User>>(`api/Project/GetAvailableUserProject?${params}`, {headers: header});
  }
  getProjectDashboard(payload: string): Observable<any> {
    let header: HttpHeaders = new HttpHeaders();
    header = header.set('reqnonotify', 'true');
    return this._http.get<CustomResponse<any>>(`api/Project/GetProjectDashboard`, {headers: header, params : {'ApiName': payload}});
  }
  getFollowingsGrid(payload: Grid, apiName: string, isNoLoading: boolean = false) {
    const params = QueryStringBuilder.BuildParametersFromSearch<Grid>(payload);
    let header: HttpHeaders = new HttpHeaders();
    if (isNoLoading) {
      header = header.set('reqnoloadingdialog', 'true');
    }
    params.set('apiName', apiName);
    return this._http.get<GridResponse<ProjectToProject>>(`api/Project/GetFollowing?${params}`, {headers: header});
  }
  getFollowersGrid(payload: Grid, apiName: string, isNoLoading: boolean = false) {
    const params = QueryStringBuilder.BuildParametersFromSearch<Grid>(payload);
    let header: HttpHeaders = new HttpHeaders();
    if (isNoLoading) {
      header = header.set('reqnoloadingdialog', 'true');
    }
    params.set('apiName', apiName);
    return this._http.get<GridResponse<ProjectToProject>>(`api/Project/GetFollower?${params}`, {headers: header});
  }
  followProject(payload: ProjectToProject) {
    return this._http.post(`api/Project/AddFollowing`, payload);
  }
  removefollow(payload: ProjectToProject) {
    return this._http.post(`api/Project/DeleteFollowing`, payload);
  }
  getAvailabilityFollowingGrid(payload: Grid, apiName: string, isNoLoading: boolean = false) {
    const params = QueryStringBuilder.BuildParametersFromSearch<Grid>(payload);
    let header: HttpHeaders = new HttpHeaders();
    if (isNoLoading) {
      header = header.set('reqnoloadingdialog', 'true');
    }
    params.set('apiName', apiName);
    return this._http.get<GridResponse<Project>>(`api/Project/CheckAvailabilityFollowing?${params}`, {headers: header});
  }
  approvalFollower(payload: ProjectToProject) {
    return this._http.post(`api/Project/ApprovalFollower`, payload);
  }

  addClaimToProject(payload: ClaimProject) {
    return this._http.post(`api/Project/CreateProjectClaim`, payload);
  }
  editClaimProject(payload: ClaimProject) {
    return this._http.post(`api/Project/UpdateProjectClaim`, payload);
  }
  removeClaimProject(payload: ClaimProject) {
    return this._http.post(`api/Project/DeleteProjectClaim`, payload);
  }

  getClaimProjectByFilterGrid(payload: Grid, apiName: string, isNoLoading: boolean = false): Observable<GridResponse<ClaimProject>> {
    const params = QueryStringBuilder.BuildParametersFromSearch<Grid>(payload);
    let header: HttpHeaders = new HttpHeaders();
    if (isNoLoading) {
      header = header.set('reqnoloadingdialog', 'true');
    }
    params.set('apiName', apiName);
    return this._http.get<GridResponse<ClaimProject>>(`api/${this.controller}/GetProjectClaimByFilterGrid?${params}`, {headers: header});
  }
  addRoleToProject(payload: Role) {
    return this._http.post(`api/Project/CreateProjectRole`, payload);
  }
  editRoleProject(payload: Role) {
    return this._http.post(`api/Project/UpdateProjectRole`, payload);
  }
  removeRoleProject(payload: Role) {
    return this._http.post(`api/Project/RemoveProjectRole`, payload);
  }
  getRoleProjectByFilterGrid(payload: Grid, apiName: string, isNoLoading: boolean = false): Observable<GridResponse<Role>> {
    const params = QueryStringBuilder.BuildParametersFromSearch<Grid>(payload);
    let header: HttpHeaders = new HttpHeaders();
    if (isNoLoading) {
      header = header.set('reqnoloadingdialog', 'true');
    }
    params.set('apiName', apiName);
    return this._http.get<GridResponse<Role>>(`api/${this.controller}/GetProjectRoleByFilterGrid?${params}`, {headers: header});
  }

  addClaimToRoleProject(payload: ProjectIdentityVM) {
    return this._http.post(`api/Project/AddClaimToProjectRole`, payload);
  }
  removeClaimFromRoleProject(payload: ProjectIdentityVM) {
    return this._http.post(`api/Project/RemoveClaimFromProjectRole`, payload);
  }
  removeClaimFromUserProject(payload: ProjectIdentityVM) {
    return this._http.post(`api/Project/RemoveClaimFromUserProject`, payload);
  }
  removeRoleFromUserProject(payload: ProjectIdentityVM) {
    return this._http.post(`api/Project/RemoveRoleFromUserProject`, payload);
  }
  getAvailableClaimForRole(ApiName: string, payload: string, cari: string): Observable<any> {
    let header: HttpHeaders = new HttpHeaders();
    header = header.set('reqnoloadingdialog', 'true');
    return this._http.get(`api/Project/GetAvailableClaimForRole`, {headers: header, params: {'ApiName': ApiName , 'IdRole': payload, 'cari': cari}});
  }
  getAvailableClaimForUser(ApiName: string, payload: string, cari: string): Observable<any> {
    let header: HttpHeaders = new HttpHeaders();
    header = header.set('reqnoloadingdialog', 'true');
    return this._http.get(`api/Project/GetAvailableClaimForUser`, {headers: header, params: {'ApiName': ApiName , 'Nik': payload, 'cari': cari}});
  }
  getAvailableRoleForUser(ApiName: string, payload: string, cari: string): Observable<any> {
    let header: HttpHeaders = new HttpHeaders();
    header = header.set('reqnoloadingdialog', 'true');
    return this._http.get(`api/Project/GetAvailableRoleForUser`, {headers: header, params: {'ApiName': ApiName , 'Nik': payload, 'cari': cari}});
  }
  getClaimOfRole(ApiName: string, payload: string): Observable<any> {
    let header: HttpHeaders = new HttpHeaders();
    header = header.set('reqnoloadingdialog', 'true');
    return this._http.get(`api/Project/GetClaimOfRole`, {headers: header, params: {'ApiName': ApiName , 'IdRole': payload}});
  }
  getClaimOfUser(ApiName: string, payload: string): Observable<any> {
    let header: HttpHeaders = new HttpHeaders();
    header = header.set('reqnoloadingdialog', 'true');
    return this._http.get(`api/Project/GetClaimOfUser`, {headers: header, params: {'ApiName': ApiName , 'Nik': payload}});
  }
  getRoleOfUser(ApiName: string, payload: string): Observable<any> {
    let header: HttpHeaders = new HttpHeaders();
    header = header.set('reqnoloadingdialog', 'true');
    return this._http.get(`api/Project/GetRoleOfUser`, {headers: header, params: {'ApiName': ApiName , 'Nik': payload}});
  }
  addRoleToUserProject(payload: ProjectIdentityVM) {
    return this._http.post(`api/Project/AddRoleToUserProject`, payload);
  }
  addClaimToUserProject(payload: ProjectIdentityVM) {
    return this._http.post(`api/Project/AddClaimoUserProject`, payload);
  }
  addUserToProject(payload: UserProject): Observable<any> {
    return this._http.post(`api/Project/AddUserToProject`, payload);
  }
  removeUserFromProject(payload: UserProject): Observable<any> {
    return this._http.post(`api/Project/RemoveUserFromProject`, payload);
  }

}
