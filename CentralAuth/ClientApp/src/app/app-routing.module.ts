import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ForgetPasswordComponent } from './pages/auth/forget-password/forget-password.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { DevNavComponent } from './dev-nav/dev-nav.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MasterUserComponent } from './pages/master-user/master-user.component';
import { MasterProjectComponent } from './pages/master-project/master-project.component';
import { MasterDirectorateComponent } from './pages/master-directorate/master-directorate.component';
import { MasterDepartmentComponent } from './pages/master-department/master-department.component';
import { MasterSubDepartmentComponent } from './pages/master-sub-department/master-sub-department.component';
import { MasterBranchComponent } from './pages/master-branch/master-branch.component';
import { MasterUnitComponent } from './pages/master-unit/master-unit.component';
import { LoggedGuard } from './guards/logged.guard';
import { GuestGuard } from './guards/guest.guard';
import { RoleGuard } from './guards/role.guard';
import { Role } from './models/enums/role.enum';
import { MyProjectComponent } from './pages/my-project/my-project.component';

const routes: Routes = [
  {
    path: '',
    component: MainNavComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [GuestGuard]
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [GuestGuard]
      },
      {
        path: 'forget-password',
        component: ForgetPasswordComponent,
        canActivate: [GuestGuard]
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [LoggedGuard],
      },
      {
        path: 'pengguna',
        component: MasterUserComponent,
        canActivate: [LoggedGuard, RoleGuard],
        data: { roles: [Role.ADMIN] }
      },
      {
        path: 'project',
        component: MasterProjectComponent,
        canActivate: [LoggedGuard, RoleGuard] ,
        data: { roles: [Role.ADMIN] }
      },
      {
        path: 'departemen',
        component: MasterDepartmentComponent,
        canActivate: [LoggedGuard, RoleGuard] ,
        data: { roles: [Role.ADMIN] }
      },
      {
        path: 'sub-departemen',
        component: MasterSubDepartmentComponent,
        canActivate: [LoggedGuard, RoleGuard] ,
        data: { roles: [Role.ADMIN] }
      },
      {
        path: 'direktorat',
        component: MasterDirectorateComponent,
        canActivate: [LoggedGuard, RoleGuard] ,
        data: { roles: [Role.ADMIN] }
      },
      {
        path: 'cabang',
        component: MasterBranchComponent,
        canActivate: [LoggedGuard, RoleGuard] ,
        data: { roles: [Role.ADMIN] }
      },
      {
        path: 'unit',
        component: MasterUnitComponent,
        canActivate: [LoggedGuard, RoleGuard] ,
        data: { roles: [Role.ADMIN] }
      },
      {
        path: 'my-project',
        component: MyProjectComponent,
        canActivate: [LoggedGuard, RoleGuard] ,
        data: { roles: [Role.DEVELOPER] }
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
