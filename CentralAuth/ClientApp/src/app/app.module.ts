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

@NgModule({
  declarations: [
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

  ],
  providers: [
    // {
    //   provide: MatPaginatorIntl,
    //   useClass: MatPaginationCustomProvider,
    // },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    CreateDirectorateComponent
  ]
})
export class AppModule {}
