import {Component} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-calendar-details-page',
  templateUrl: './calendar-details-page.component.html',
  styleUrls: ['./calendar-details-page.component.scss']
})
export class CalendarDetailsPageComponent {

  reloadEvents$ = new BehaviorSubject<boolean>(false);

  constructor() {
  }

}
