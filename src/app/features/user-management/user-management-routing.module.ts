import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { FlightBookingComponent } from './components/flight-booking/flight-booking.component';
import { HotelsBookingComponent } from './components/hotels-booking/hotels-booking.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserManagementComponent } from './user-management.component';

const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'user-profile',
        pathMatch: 'full',
      },
      {
        path: 'user-profile',
        component: UserProfileComponent,
      },
      {
        path: 'flight-booking',
        component: FlightBookingComponent,
      },
      {
        path: 'hotels-booking',
        component: HotelsBookingComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementRoutingModule {}
