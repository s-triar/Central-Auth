import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

import { MainNavComponent } from './main-nav/main-nav.component';
import { DevNavComponent } from './dev-nav/dev-nav.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ForgetPasswordComponent } from './pages/auth/forget-password/forget-password.component';
import { UserSideNavComponent } from './components/user-side-nav/user-side-nav.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MaterialModule } from './material.module';
import { CardProjectItemComponent } from './components/card-project-item/card-project-item.component';
import { CardUserLoginComponent } from './components/card-user-login/card-user-login.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { CardProjectListComponent } from './components/card-project-list/card-project-list.component';
import { CardProjectAdminItemComponent } from './components/card-project-admin-item/card-project-admin-item.component';
import { CardProjectAdminListComponent } from './components/card-project-admin-list/card-project-admin-list.component';
import { MasterUserComponent } from './pages/master-user/master-user.component';
import { MasterProjectComponent } from './pages/master-project/master-project.component';
import { MasterDirectorateComponent } from './pages/master-directorate/master-directorate.component';
import { MasterDepartmentComponent } from './pages/master-department/master-department.component';
import { CreateDirectorateComponent } from './pages/master-directorate/dialogs/create-directorate/create-directorate.component';
import { ChangeIconOnHoverDirective } from './directives/change-icon-on-hover.directive';
import { DialogLoadingComponent } from './components/dialog-loading/dialog-loading.component';
import { SnackbarNotifComponent } from './components/snackbar-notif/snackbar-notif.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginationCustomProvider } from './providers/mat-pagination-custom-provider';
import { UpdateDirectorateComponent } from './pages/master-directorate/dialogs/update-directorate/update-directorate.component';
import { DeleteDirectorateComponent } from './pages/master-directorate/dialogs/delete-directorate/delete-directorate.component';
import { MasterSubDepartmentComponent } from './pages/master-sub-department/master-sub-department.component';
import { CreateDepartmentComponent } from './pages/master-department/dialogs/create-department/create-department.component';
import { DeleteDepartmentComponent } from './pages/master-department/dialogs/delete-department/delete-department.component';
import { UpdateDepartmentComponent } from './pages/master-department/dialogs/update-department/update-department.component';
import { CreateSubDepartmentComponent } from './pages/master-sub-department/dialogs/create-sub-department/create-sub-department.component';
import { DeleteSubDepartmentComponent } from './pages/master-sub-department/dialogs/delete-sub-department/delete-sub-department.component';
import { UpdateSubDepartmentComponent } from './pages/master-sub-department/dialogs/update-sub-department/update-sub-department.component';
import { MasterBranchComponent } from './pages/master-branch/master-branch.component';
import { MasterUnitComponent } from './pages/master-unit/master-unit.component';
import { CreateBranchComponent } from './pages/master-branch/dialogs/create-branch/create-branch.component';
import { DeleteBranchComponent } from './pages/master-branch/dialogs/delete-branch/delete-branch.component';
import { UpdateBranchComponent } from './pages/master-branch/dialogs/update-branch/update-branch.component';
import { CreateUnitComponent } from './pages/master-unit/dialogs/create-unit/create-unit.component';
import { UpdateUnitComponent } from './pages/master-unit/dialogs/update-unit/update-unit.component';
import { DeleteUnitComponent } from './pages/master-unit/dialogs/delete-unit/delete-unit.component';
import { DeleteUserComponent } from './pages/master-user/dialogs/delete-user/delete-user.component';
import { UpdateUserComponent } from './pages/master-user/dialogs/update-user/update-user.component';
import { CreateUserComponent } from './pages/master-user/dialogs/create-user/create-user.component';
import { interceptorProviders } from './interceptors';
import { RolesDirective } from './directives/roles.directive';
import { RoleUserComponent } from './pages/master-user/dialogs/role-user/role-user.component';
// import { JwtModule } from '@auth0/angular-jwt';

@NgModule({
  declarations: [
    RolesDirective,
    AppComponent,
    MainNavComponent,
    DevNavComponent,
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    UserSideNavComponent,
    DashboardComponent,
    CardProjectItemComponent,
    CardUserLoginComponent,
    CardProjectListComponent,
    CardProjectAdminItemComponent,
    CardProjectAdminListComponent,
    MasterUserComponent,
    MasterProjectComponent,
    MasterDirectorateComponent,
    MasterDepartmentComponent,
    CreateDirectorateComponent,
    ChangeIconOnHoverDirective,
    DialogLoadingComponent,
    SnackbarNotifComponent,
    UpdateDirectorateComponent,
    DeleteDirectorateComponent,
    MasterSubDepartmentComponent,
    CreateDepartmentComponent,
    DeleteDepartmentComponent,
    UpdateDepartmentComponent,
    CreateSubDepartmentComponent,
    DeleteSubDepartmentComponent,
    UpdateSubDepartmentComponent,
    MasterBranchComponent,
    MasterUnitComponent,
    CreateBranchComponent,
    DeleteBranchComponent,
    UpdateBranchComponent,
    CreateUnitComponent,
    UpdateUnitComponent,
    DeleteUnitComponent,
    DeleteUserComponent,
    UpdateUserComponent,
    CreateUserComponent,
    RoleUserComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    GoogleChartsModule,
    HttpClientModule,
    FormsModule,
    FlexLayoutModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    // JwtModule.forRoot({
    //   config: {
    //     tokenGetter: () => {
    //       return localStorage.getItem('access_token');
    //     }
    //   },
    // }),
  ],
  providers: [
    ...interceptorProviders
    // {
    //   provide: MatPaginatorIntl,
    //   useClass: MatPaginationCustomProvider,
    // },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogLoadingComponent,

    CreateDirectorateComponent,
    DeleteDirectorateComponent,
    UpdateDirectorateComponent,

    CreateDepartmentComponent,
    DeleteDepartmentComponent,
    UpdateDepartmentComponent,

    CreateSubDepartmentComponent,
    DeleteSubDepartmentComponent,
    UpdateSubDepartmentComponent,

    CreateBranchComponent,
    DeleteBranchComponent,
    UpdateBranchComponent,

    CreateUnitComponent,
    DeleteUnitComponent,
    UpdateUnitComponent,

    CreateUserComponent,
    DeleteUserComponent,
    UpdateUserComponent,
    RoleUserComponent
  ]
})
export class AppModule {}
