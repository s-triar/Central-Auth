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
import { DeleteFollowingProjectComponent } from './following-project/dialogs/delete-following-project/delete-following-project.component';
import { CreateFollowingProjectComponent } from './following-project/dialogs/create-following-project/create-following-project.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ApprovalFollowerComponent } from './follower-project/approval-follower/approval-follower.component';
import { CreateRoleProjectComponent } from './role-project/dialogs/create-role-project/create-role-project.component';
import { UpdateRoleProjectComponent } from './role-project/dialogs/update-role-project/update-role-project.component';
import { DeleteRoleProjectComponent } from './role-project/dialogs/delete-role-project/delete-role-project.component';
import { DeleteUserProjectComponent } from './user-project/dialogs/delete-user-project/delete-user-project.component';
import { CreateUserProjectComponent } from './user-project/dialogs/create-user-project/create-user-project.component';
import { ClaimRoleProjectComponent } from './role-project/dialogs/claim-role-project/claim-role-project.component';
import { ClaimProjectComponent } from './claim-project/claim-project.component';
import { CreateClaimProjectComponent } from './claim-project/dialogs/create-claim-project/create-claim-project.component';
import { UpdateClaimProjectComponent } from './claim-project/dialogs/update-claim-project/update-claim-project.component';
import { DeleteClaimProjectComponent } from './claim-project/dialogs/delete-claim-project/delete-claim-project.component';
import { ClaimUserProjectComponent } from './user-project/dialogs/claim-user-project/claim-user-project.component';
import { RoleUserProjectComponent } from './user-project/dialogs/role-user-project/role-user-project.component';
// import { ScopeProjectComponent } from './scope-project/scope-project.component';
// import { CreateScopeProjectComponent } from './scope-project/dialogs/create-scope-project/create-scope-project.component';
// import { DeleteScopeProjectComponent } from './scope-project/dialogs/delete-scope-project/delete-scope-project.component';
// import { UpdateScopeProjectComponent } from './scope-project/dialogs/update-scope-project/update-scope-project.component';

@NgModule({
  declarations: [
    DevComponent,
    DevNavComponent,
    DetailProjectComponent,
    UserProjectComponent,
    RoleProjectComponent,
    FollowerProjectComponent,
    FollowingProjectComponent,
    DeleteFollowingProjectComponent,
    CreateFollowingProjectComponent,
    ApprovalFollowerComponent,
    CreateRoleProjectComponent,
    UpdateRoleProjectComponent,
    DeleteRoleProjectComponent,
    DeleteUserProjectComponent,
    CreateUserProjectComponent,
    ClaimRoleProjectComponent,
    ClaimProjectComponent,
    CreateClaimProjectComponent,
    UpdateClaimProjectComponent,
    DeleteClaimProjectComponent,
    ClaimUserProjectComponent,
    RoleUserProjectComponent,
    // ScopeProjectComponent,
    // CreateScopeProjectComponent,
    // DeleteScopeProjectComponent,
    // UpdateScopeProjectComponent,
  ],
  imports: [
    CommonModule,
    DevRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    DeleteFollowingProjectComponent,
    CreateFollowingProjectComponent,
    ApprovalFollowerComponent,
    CreateRoleProjectComponent,
    UpdateRoleProjectComponent,
    DeleteRoleProjectComponent,
    CreateUserProjectComponent,
    DeleteUserProjectComponent,
    ClaimRoleProjectComponent,
    ClaimProjectComponent,
    CreateClaimProjectComponent,
    UpdateClaimProjectComponent,
    DeleteClaimProjectComponent,
    ClaimUserProjectComponent,
    RoleUserProjectComponent,
    // CreateScopeProjectComponent,
    // DeleteScopeProjectComponent,
    // UpdateScopeProjectComponent,
  ]
})
export class DevModule { }
