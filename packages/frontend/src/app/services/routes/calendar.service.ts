import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ICalendar} from "calendar-shared/db-models/ICalendar";
import {IEvent} from "calendar-shared/db-models/IEvent";
import {environment} from "../../../environments/environment";
import {AbstractApiService} from "./abstract.api.service";

@Injectable()
export class CalendarService extends AbstractApiService {

  URL = `${environment.backendAPI}/calendars`
  URLShared = `${environment.backendAPI}/calendar-shared`
  constructor(private http: HttpClient) {
    super()
  }

  getAllCalendarsForUser() {
    return this.http.get<ICalendar[]>(`${this.URL}`, {headers: this.getAuthHeaders()})
  }

  createCalendar(name: string) {
    return this.http.post<ICalendar>(`${this.URL}`, {
      name: name
    } as ICalendar, {headers: this.getAuthHeaders()})
  }

  deleteCalendarById(id: number) {
    return this.http.delete<ICalendar>(`${this.URL}/${id}`, {headers: this.getAuthHeaders()})
  }

  getCalendarById(id: number) {
    return this.http.get<ICalendar>(`${this.URL}/${id}`, {headers: this.getAuthHeaders()})
  }

  getEventsForCalendar(calendarId: number) {
    return this.http.get<IEvent[]>(`${this.URL}/${calendarId}/events`, {headers: this.getAuthHeaders()})
  }

  createCalendarEvent(item: IEvent) {
    return this.http.post<IEvent>(`${this.URL}/${item.calendarId}/events`, item, {headers: this.getAuthHeaders()})
  }

  getSharedCalendar(identifier: string) {
    return this.http.get<ICalendar>(`${this.URLShared}/${identifier}`)
  }

  getAllEventsForShared(identifier: string) {
    return this.http.get<IEvent[]>(`${this.URLShared}/${identifier}/events`)
  }

}
