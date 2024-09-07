import {Injectable} from "@angular/core";

@Injectable()
export class AuthenticationUtilsService {


  logout(): void {
    localStorage.removeItem('token');
    window.location.href = 'login'
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
