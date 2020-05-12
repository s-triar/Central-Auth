import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule } from "@angular/forms";

import { NgxsModule } from "@ngxs/store";
import { NgxsLoggerPluginModule } from "@ngxs/logger-plugin";
import { NgxsStoragePluginModule } from "@ngxs/storage-plugin";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";

import { MainNavComponent } from "./main-nav/main-nav.component";
import { DevNavComponent } from "./dev-nav/dev-nav.component";
import { LoginComponent } from "./pages/auth/login/login.component";
import { RegisterComponent } from "./pages/auth/register/register.component";
import { ForgetPasswordComponent } from "./pages/auth/forget-password/forget-password.component";
import { UserSideNavComponent } from "./components/user-side-nav/user-side-nav.component";
import { ThemeState } from "./states/theme.state";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { MaterialModule } from "./material.module";
import { CardProjectItemComponent } from "./components/card-project-item/card-project-item.component";
import { CardUserLoginComponent } from "./components/card-user-login/card-user-login.component";
import { GoogleChartsModule } from "angular-google-charts";
import { CardProjectListComponent } from './components/card-project-list/card-project-list.component';
import { CardProjectAdminItemComponent } from './components/card-project-admin-item/card-project-admin-item.component';
import { CardProjectAdminListComponent } from './components/card-project-admin-list/card-project-admin-list.component';
import { MasterUserComponent } from './pages/master-user/master-user.component';
import { MasterProjectComponent } from './pages/master-project/master-project.component';
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
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
    GoogleChartsModule,
    HttpClientModule,
    FormsModule,
    FlexLayoutModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxsModule.forRoot([ThemeState]),
    NgxsStoragePluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
