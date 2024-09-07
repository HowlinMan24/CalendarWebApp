import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {AbstractApiService} from "./abstract.api.service";

@Injectable()
export class EventsService extends AbstractApiService {
  private URL =  `${environment.backendAPI}/events`;

  constructor(private http: HttpClient) {
    super();
  }

  deleteEvent(itemId: number) {
    return this.http.delete<number>(`${this.URL}/${itemId}`, {headers: this.getAuthHeaders()});
  }

}
