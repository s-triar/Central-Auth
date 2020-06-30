import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevComponent } from './dev.component';
import { LoggedGuard } from 'src/app/guards/logged.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
import { Role } from 'src/app/models/enums/role.enum';
import { DetailProjectComponent } from './detail-project/detail-project.component';
import { RoleGuardChildrenGuard } from 'src/app/guards/role-guard-children.guard';
import { UserProjectComponent } from './user-project/user-project.component';
import { RoleProjectComponent } from './role-project/role-project.component';
import { FollowerProjectComponent } from './follower-project/follower-project.component';
import { FollowingProjectComponent } from './following-project/following-project.component';

const routes: Routes = [
  {
    path: ':project_name',
    component: DevComponent,
    data: { roles: [Role.ADMIN] },
    canActivate: [LoggedGuard, RoleGuard],
    canActivateChild: [RoleGuardChildrenGuard],
    children: [
      {
        path: 'dashboard',
        component: DetailProjectComponent
      },
      {
        path: 'user-project',
        component: UserProjectComponent
      },
      {
        path: 'role-project',
        component: RoleProjectComponent
      },
      {
        path: 'follower-project',
        component: FollowerProjectComponent
      },
      {
        path: 'following-project',
        component: FollowingProjectComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevRoutingModule { }
