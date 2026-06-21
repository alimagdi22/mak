import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SideNavContentComponent } from './components/side-nav-content/side-nav-content.component';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementComponent } from './user-management.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { FlightBookingComponent } from './components/flight-booking/flight-booking.component';
import { HotelsBookingComponent } from './components/hotels-booking/hotels-booking.component';
import { FlightCardComponent } from './components/flight-card/flight-card.component';
import { HotelCardComponent } from './components/hotel-card/hotel-card.component';
import { TicketsComponent } from './components/flight-card/tickets/tickets.component';
import { SignOutAlertModalComponent } from '../../shared/components/user-management/sign-out-alert-modal/sign-out-alert-modal.component';

@NgModule({
  declarations: [
    UserManagementComponent,
    SideNavContentComponent,
    UserProfileComponent,
    FlightBookingComponent,
    HotelsBookingComponent,
    FlightCardComponent,
    HotelCardComponent,
    TicketsComponent,
  ],
  imports: [CommonModule, UserManagementRoutingModule, SharedModule, SignOutAlertModalComponent],
})
export class UserManagementModule {}
