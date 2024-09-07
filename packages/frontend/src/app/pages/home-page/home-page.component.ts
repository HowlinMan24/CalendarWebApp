import {Component, OnInit, Output, ViewChild} from '@angular/core';
import {BehaviorSubject, firstValueFrom, Observable, switchMap} from "rxjs";
import {CalendarService} from "../../services/routes/calendar.service";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ICalendar} from "calendar-shared/db-models/ICalendar";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  providers: [NgbActiveModal]
})
export class HomePageComponent implements OnInit {
  reloadCalendar$ = new BehaviorSubject<void>(null);

  calendars: Observable<ICalendar[]>;
  calendarToken!: string | undefined;
  @Output() calendarId!: number;
  @ViewChild('myModal') myModal!: NgbModal;

  constructor(private calendarService: CalendarService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.calendars = this.reloadCalendar$.pipe(
      switchMap(() => this.calendarService.getAllCalendarsForUser()),
    )
  }

  async getLinkForCalendar(id: number) {
    try {
      const calendar = await firstValueFrom(this.calendarService.getCalendarById(id));
      this.calendarToken = calendar.identifier;
      this.modalService.open(this.myModal, {centered: true});
    } catch (error) {
      console.error('Error fetching calendar', error);
    }
  }

  refreshCalendar() {
    this.reloadCalendar$.next();
  }

  deleteSelectedCalendar(id: number) {
    this.calendarService.deleteCalendarById(id).subscribe(() => {
      this.refreshCalendar();
    })
  }
}
