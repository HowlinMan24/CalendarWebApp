import {Component, Input, OnInit} from '@angular/core';
import Calendar from 'js-year-calendar';
import CalendarDataSourceElement from "js-year-calendar/dist/interfaces/CalendarDataSourceElement";
import CalendarDayEventObject from "js-year-calendar/dist/interfaces/CalendarDayEventObject";
import {BehaviorSubject, combineLatestWith, Observable, switchMap} from "rxjs";
import {CalendarService} from "../../services/routes/calendar.service";
import {ActivatedRoute} from "@angular/router";
import {IEvent} from "calendar-shared/db-models/IEvent";
import {ICalendar} from "calendar-shared/db-models/ICalendar";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {

  calendar: Observable<ICalendar>;
  calendarDataSourceElement!: Calendar<CalendarDataSourceElement>;

  @Input() reloadEvents = new BehaviorSubject<boolean>(true);
  @Input() calendarToken: string;
  @Input() shared:boolean;

  constructor(private calendarService: CalendarService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    if (!this.shared) {
      this.calendar = this.route.params.pipe(
        map(it => it['id']),
        switchMap(id => this.calendarService.getCalendarById(id))
      )
    } else {
      this.calendar = this.route.paramMap.pipe(
        switchMap(params => {
          const token = params.get('calendarToken')
          return this.calendarService.getSharedCalendar(token);
        })
      )
    }
    this.calendarDataSourceElement = new Calendar('#calendar', {
      clickDay(e: CalendarDayEventObject<CalendarDataSourceElement>): void {
        // TODO MAKE MODAL WINDOW TO CREATE NEW RECORD
      },
      contextMenuItems: [],
      customDataSourceRenderer(element: HTMLElement, currentDate: Date, events: CalendarDataSourceElement[]): void {
      },
      dayContextMenu(e: CalendarDayEventObject<CalendarDataSourceElement>): void {
      },
      loadingTemplate: 'undefined',
      dataSource: [] = [],
      mouseOnDay(e: CalendarDayEventObject<CalendarDataSourceElement>): void {
      },
      mouseOutDay(e: CalendarDayEventObject<CalendarDataSourceElement>): void {
      },
      enableRangeSelection: true
    })

    let events: Observable<IEvent[]>;

    if (this.shared) {
      events = this.route.paramMap.pipe(
        switchMap(params => {
          const token = params.get('calendarToken')
          return this.calendarService.getAllEventsForShared(token);
        })
      )
    } else {
      events = this.calendar.pipe(
        combineLatestWith(this.reloadEvents),
        map(it => it[0]),
        switchMap(calendar => this.calendarService.getEventsForCalendar(calendar.id))
      );
    }

    events.subscribe(events => {
      this.calendarDataSourceElement.setDataSource(this.parseData(events))
    });

  }

  parseData(data: IEvent[]) {
    return data.map(event => ({
      id: event.id,
      name: 'to be defined',
      startDate: new Date(event.date),
      endDate: new Date(event.date)
    }))
  }
}
