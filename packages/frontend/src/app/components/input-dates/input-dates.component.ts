import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CalendarService} from '../../services/routes/calendar.service';
import {BehaviorSubject, combineLatestWith, Observable} from 'rxjs';
import {map, shareReplay, switchMap} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IEvent} from 'calendar-shared/db-models/IEvent';
import {MatTableDataSource} from '@angular/material/table';
import {EventsService} from "../../services/routes/events.service";

@Component({
  selector: 'app-input-dates',
  templateUrl: './input-dates.component.html',
  styleUrls: ['./input-dates.component.scss']
})
export class InputDatesComponent implements OnInit {

  @Input() shared: boolean;
  @Input() displayHomeCalendarId: number;
  @Output() eventsChanged = new EventEmitter<void>();

  items: Observable<IEvent[]>;
  eventDateCreationForm: FormGroup;
  dataSource: MatTableDataSource<IEvent>;
  displayedColumns: string[] = [];

  reloadTable$ = new BehaviorSubject<boolean>(true);

  constructor(
    private fb: FormBuilder,
    private eventsService: EventsService,
    private calendarService: CalendarService,
    private route: ActivatedRoute
  ) {
    this.eventDateCreationForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      busyStatus: ['', Validators.required],
      date: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.displayHomeCalendarId) {
      this.items = this.calendarService.getEventsForCalendar(this.displayHomeCalendarId);
      this.displayedColumns = ['date', 'title'];
    } else {
      if (this.shared) {
        this.items = this.route.paramMap.pipe(
          switchMap(params => {
            const token = params.get('calendarToken');
            return this.calendarService.getAllEventsForShared(token);
          })
        );
        this.displayedColumns = ['date', 'title'];
      } else {
        this.items = this.route.params.pipe(
          combineLatestWith(this.reloadTable$),
          map(([params, refresh]) => params['id']),
          switchMap(id => this.calendarService.getEventsForCalendar(id)),
          shareReplay(1)
        );
        this.displayedColumns = ['date', 'title', 'actions'];
      }
    }

    this.items.pipe(
      map(x => this.dataSource = new MatTableDataSource(x))
    );

    this.reloadTable$.next(true);
  }

  onSubmit(): void {
    if (this.eventDateCreationForm.valid && !this.shared) {
      let item = {
        date: this.eventDateCreationForm.get('date').value,
        title: this.eventDateCreationForm.get('title').value,
        description: this.eventDateCreationForm.get('description').value,
        busyStatus: this.eventDateCreationForm.get('busyStatus').value,
        calendarId: this.route.snapshot.params['id']
      } as IEvent;
      this.calendarService.createCalendarEvent(item).subscribe({
        next: response => {
          this.eventDateCreationForm.reset();
          this.eventsChanged.emit();
          this.reloadTable$.next(true);
        },
        error: error => {
          console.error('Error posting date:', error);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }

  deleteItem(item: IEvent): void {
    if (!this.shared) {
      this.eventsService.deleteEvent(item.id).subscribe({
        next: () => {
          this.eventsChanged.emit();
          this.reloadTable$.next(true);
        },
        error: error => {
          console.error('Error deleting item:', error);
        }
      });
    }
  }
}
