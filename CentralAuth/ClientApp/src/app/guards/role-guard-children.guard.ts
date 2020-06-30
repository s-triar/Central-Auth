import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardChildrenGuard implements CanActivateChild {

  constructor(private _authService: AuthService, private _router: Router) {

  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const currentUser = this._authService.user.value;
      if (currentUser && currentUser.nik !== null) {
        const rolesUser = this._authService.user_roles.value;
        if (rolesUser.includes('SUPERADMIN')) { // just by pass route for super admin
          return true;
        }
        if (next.data.roles && this.checkRoles(next.data.roles, rolesUser) === false) {
          this._router.navigate(['/']);
          return false;
        }
        return true;
      }
      this._router.navigate(['login']);
      return false;
  }

  private checkRoles(requirement: string[], roles: string[]): boolean {
    for (const r of roles) {
      if (requirement.includes(r)) {
        return true;
      }
    }
    return false;
  }
}
