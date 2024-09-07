import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthenticationUtilsService} from "../util-services/AuthenticationUtilsService";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authUtils: AuthenticationUtilsService
  ) {
  }

  canActivate(): boolean {
    if (this.authUtils.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
