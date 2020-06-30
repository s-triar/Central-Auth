import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DevRoutingModule } from './dev-routing.module';
import { DevComponent } from './dev.component';
import { DevNavComponent } from '../../dev-nav/dev-nav.component';

import { DetailProjectComponent } from './detail-project/detail-project.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { UserProjectComponent } from './user-project/user-project.component';
import { RoleProjectComponent } from './role-project/role-project.component';
import { FollowerProjectComponent } from './follower-project/follower-project.component';
import { FollowingProjectComponent } from './following-project/following-project.component';

@NgModule({
  declarations: [DevComponent, DevNavComponent, DetailProjectComponent, UserProjectComponent, RoleProjectComponent, FollowerProjectComponent, FollowingProjectComponent],
  imports: [
    CommonModule,
    DevRoutingModule,
    SharedModule
  ]
})
export class DevModule { }
