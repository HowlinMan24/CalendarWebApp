import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomePageComponent} from './pages/home-page/home-page.component';
import {InputDatesComponent} from './components/input-dates/input-dates.component';
import {CalendarComponent} from "./components/calendar/calendar.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {NavbarComponent} from "./components/navbar/navbar.component";
import {FooterComponent} from "./components/footer/footer.component";
import {CalendarDetailsPageComponent} from "./pages/calendar-details-page/calendar-details-page.component";
import {RegistrationPageComponent} from "./pages/registration-page/registration-page.component";
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {WelcomePageComponent} from "./pages/welcome-page/welcome-page.component";
import {AuthenticationUtilsService} from "./services/util-services/AuthenticationUtilsService";
import {AuthenticationService} from "./services/routes/authentication.service";
import {CalendarService} from "./services/routes/calendar.service";
import {UserService} from "./services/routes/user.service";
import {EventsService} from "./services/routes/events.service";
import {CalendarSharedPageComponent} from "./pages/calendar-shared-page/calendar-shared-page.component";
import {MatAnchor, MatButton, MatIconButton} from "@angular/material/button";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardModule} from "@angular/material/card";
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {MatSidenav, MatSidenavContainer} from "@angular/material/sidenav";
import {MatInput} from "@angular/material/input";
import {MatDialogActions, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {FlexLayoutModule} from "ngx-flexible-layout";
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    InputDatesComponent,
    CalendarComponent,
    NavbarComponent,
    FooterComponent,
    CalendarDetailsPageComponent,
    RegistrationPageComponent,
    LoginPageComponent,
    WelcomePageComponent,
    CalendarSharedPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatCard,
    MatCardFooter,
    MatCardContent,
    MatToolbar,
    MatNavList,
    MatListItem,
    MatIconButton,
    MatIcon,
    MatSidenavContainer,
    MatSidenav,
    MatButton,
    BrowserAnimationsModule,
    MatCardHeader,
    FlexLayoutModule,
    MatToolbarRow,
    MatCardModule,
    MatAnchor,
    MatHeaderCell,
    MatCell,
    MatColumnDef,
    MatHeaderRow,
    MatRow,
    MatTable,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    MatInput,
    MatCellDef,
    MatHeaderCellDef,
    MatRowDef,
    MatHeaderRowDef,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatGridList,
    MatGridTile
  ],
  providers: [
    AuthenticationUtilsService,
    AuthenticationService,
    CalendarService,
    UserService,
    EventsService,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
