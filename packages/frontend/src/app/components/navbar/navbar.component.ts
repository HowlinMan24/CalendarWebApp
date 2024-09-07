import {Component, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/routes/authentication.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthenticationUtilsService} from "../../services/util-services/AuthenticationUtilsService";
import {CalendarService} from "../../services/routes/calendar.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
  userEmail!: string | undefined | null;

  @ViewChild('createCalendarModal') calendarModal!: any;

  calendarName: string = '';
  @Output() calendarToken: string;


  constructor(private auth: AuthenticationService,
              private calendarService: CalendarService,
              private modalService: NgbModal,
              private router: Router,
              private authUtils: AuthenticationUtilsService) {
  }

  isLogged(): boolean {
    return this.authUtils.isLoggedIn();
  }

  setUserEmail(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.userEmail = this.auth.getLoggedUser()?.email;
    }
  }

  logout(): void {
    this.authUtils.logout();
    this.userEmail = null;
  }

  ngOnInit(): void {
    if (this.isLogged()) {
      this.setUserEmail();
    }
  }

  openCreateCalendarModal() {
    if (this.isLogged()) {
      this.modalService.open(this.calendarModal, {centered: true});
    }
  }

  async createCalendar(modal: any) {
    if (this.calendarName) {
      this.calendarService.createCalendar(this.calendarName).subscribe({
        next: async calendar => {
          await this.router.navigate(['/calendar/' + calendar.id])
          modal.close();
        }
      })
    }
  }
}

