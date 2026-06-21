import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'rp-travel-ui';
import { GoogleTagManagerService } from 'angular-google-tag-manager';

@Component({
  selector: 'app-flight-confirmation',
  templateUrl: './flight-confirmation.component.html',
  styleUrl: './flight-confirmation.component.scss',
})
export class FlightConfirmationComponent implements OnInit {
  public confirmationService = inject(ConfirmationService);
  private route = inject(ActivatedRoute);
  private gtmService = inject(GoogleTagManagerService);

  todayDate = new Date();

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.has('sid') && this.route.snapshot.queryParamMap.has('HG')) {
      this.confirmationService.getConfirmationDate(
        this.route.snapshot.queryParamMap.get('sid') ?? '',
        this.route.snapshot.queryParamMap.get('HG') ?? '',
        this.route.snapshot.queryParamMap.get('tok') ?? '',
      );

      // Push GTM event when confirmation page loads
      this.gtmService.pushTag({
        event: 'booking_confirmation',
        page: 'flight-confirmation',
        bookingReference: this.route.snapshot.queryParamMap.get('sid') ?? '',
        timestamp: new Date().toISOString(),
      });
    }
  }

  public get flights() {
    return this.confirmationService.confirmationData.airItineraries[0].allJourney.flights;
  }

  public get airItineraries() {
    return this.confirmationService.confirmationData.airItineraries[0];
  }
  public get passangers() {
    return this.confirmationService.confirmationData.passengersDetails;
  }
}
