import { Directive, ViewContainerRef, TemplateRef, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appRoles]',
})
export class RolesDirective {

  constructor(private _templateRef: TemplateRef<any>,
              private _viewContainer: ViewContainerRef,
              private _authService: AuthService
  ) {}

  @Input() set appRoles(allowedRoles: Array<string>) {

    let shouldShow = false;
    const userRoles: Array<string> = this._authService.user_roles.value;
    for (const role of userRoles) {
      if (role.toUpperCase() === 'SUPERADMIN') {
        shouldShow = true;
        break;
      }
      for (let allowedRole of allowedRoles) {
        allowedRole = allowedRole.toUpperCase();
        if (allowedRole.toUpperCase() === role.toUpperCase()) {
          shouldShow = true;
          break;
        }
      }
    }
    if (shouldShow) {
      this._viewContainer.createEmbeddedView(this._templateRef);
    } else {
      this._viewContainer.clear();
    }
  }

}
