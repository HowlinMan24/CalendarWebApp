import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AbstractApiService} from "./abstract.api.service";
import {IUser} from "calendar-shared/db-models/IUser";

@Injectable()
export class UserService extends AbstractApiService {

  private URL = `${environment.backendAPI}/user`;

  constructor(private http: HttpClient) {
    super()
  }

  createUser(user: IUser) {
    return this.http.post<IUser>(`${this.URL}`, user, {headers: this.getAuthHeaders()});
  }
}
