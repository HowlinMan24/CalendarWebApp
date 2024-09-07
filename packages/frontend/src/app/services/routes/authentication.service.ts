import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {IUser} from "calendar-shared/db-models/IUser";
import {jwtDecode} from 'jwt-decode';
import {LoginBody, LoginResponse} from "calendar-shared/api/authentication-controller-types";
import {environment} from "../../../environments/environment";
import {AbstractApiService} from "./abstract.api.service";

@Injectable()
export class AuthenticationService extends AbstractApiService {

  private URL = `${environment.backendAPI}/auth`

  constructor(private http: HttpClient) {
    super();
  }

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.URL}/login`, {email, password} as LoginBody).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  getLoggedUser(): IUser | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decodedToken = jwtDecode<any>(token);
      return {
        id: decodedToken.id,
        firstName: decodedToken.firstName,
        lastName: decodedToken.lastName,
        email: decodedToken.email,
        password: decodedToken.password,
        createdAt: new Date(decodedToken.createdAt),
        updatedAt: new Date(decodedToken.updatedAt)
      } as IUser;
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }

  }


}
