import {HttpHeaders} from "@angular/common/http";

export abstract class AbstractApiService {

  protected getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
