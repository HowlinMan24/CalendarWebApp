import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CalendarDetailsPageComponent} from "./pages/calendar-details-page/calendar-details-page.component";
import {RegistrationPageComponent} from "./pages/registration-page/registration-page.component";
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {WelcomePageComponent} from "./pages/welcome-page/welcome-page.component";
import {AuthGuard} from "./services/guards/auth.guard";
import {CalendarSharedPageComponent} from "./pages/calendar-shared-page/calendar-shared-page.component";
import {HomePageComponent} from "./pages/home-page/home-page.component";


const routes: Routes = [
  {path: '', component: WelcomePageComponent},
  {path: 'registration', component: RegistrationPageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'home', component: HomePageComponent, canActivate: [AuthGuard]},
  {path: 'calendar/:id', component: CalendarDetailsPageComponent, canActivate: [AuthGuard]},
  {path: 'calendar-shared/:calendarToken', component: CalendarSharedPageComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
