import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FlightCheckoutService, FlightResultService, FlightSearchService, HomePageService, selectedFlight } from '../../../../../dist/rp-travel-ui';
import { SharedService } from '../../../shared/shared.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { GoogleTagManagerService } from 'angular-google-tag-manager';


@Component({
  selector: 'app-flights-checkout',
  templateUrl: './flights-checkout.component.html',
  styleUrls: ['./flights-checkout.component.scss'],
})
export class FlightsCheckoutComponent implements OnInit, OnDestroy {
  homePageService = inject(HomePageService);
  translate = inject(TranslateService);
  sharedService = inject(SharedService);
  flightCheckoutService = inject(FlightCheckoutService);
  flightSearchService = inject(FlightSearchService);
  flightResultService = inject(FlightResultService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  activatedRoute = inject(ActivatedRoute);
  gtmService = inject(GoogleTagManagerService);

  subscription = new Subscription();
  totalPassengers = 0;
  selectedFlight!: selectedFlight;
  isSelectedFlightInvalid = false;

  sessionTimer = 240;

  ngOnInit(): void {

    this.subscription.add(
      this.flightCheckoutService.paymentLinkFailure.subscribe({
        next: () => {
          this.sharedService.isPaymentModalShowed = true;
          this.cdr.detectChanges();
        },
      }),
    );

    this.subscription.add(
      this.flightCheckoutService.selectedFlightLang.subscribe({
        next: () => {
          if (this.flightCheckoutService.selectedFlight) {
            this.selectedFlight = this.flightCheckoutService.selectedFlight;
            this.cdr.detectChanges();
          }
        },
      }),
    );

    this.subscription.add(
      this.flightResultService.brandedFareNotifier.subscribe({
        next: () => {
          if(!this.flightResultService.currentSelectedBrands.length) {
            this.sharedService.selectedBrandedIndex = -1;
          }
        }
      })
    )

    this.subscription.add(
      this.flightCheckoutService.notify.subscribe({
        next: (value) => {
          if(value === 3) {
            this.isSelectedFlightInvalid = true;
          }
        }
      })
    )

    // Push GTM event when checkout page loads
    this.gtmService.pushTag({
      event: 'checkout_view',
      page: 'flights-checkout',
      timestamp: new Date().toISOString(),
    });
  }

goBackToResultsPage() {
  const searchCriteria = this.flightCheckoutService.selectedFlight?.searchCriteria || this.selectedFlight?.searchCriteria;
  
  console.log('goBackToResultsPage triggered', { searchCriteria });

  if (!searchCriteria) {
    console.error('No search criteria found for navigation');
    return;
  }

  // Convert Wego search criteria to the format expected by the search form
  const formData = this.convertSearchCriteriaToFormData(searchCriteria);
  
  // Store the converted form data in localStorage
  // localStorage.setItem('form', JSON.stringify(formData));
  
  // Also store individual airport data for multicity scenarios
  this.storeAirportData(searchCriteria);

  // Set the search form values
  switch (searchCriteria.flightType) {
    case 'Oneway':
      this.flightSearchService.searchFlight.get('flightType')?.setValue('Oneway');
      break;
    case 'Roundtrip':
      this.flightSearchService.searchFlight.get('flightType')?.setValue('RoundTrip');
      break;
    case 'Multicity':
      this.flightSearchService.searchFlight.get('flightType')?.setValue('MultiCity');
      break;
  }

  this.flightSearchService.searchFlight?.get('passengers.adults')?.setValue(searchCriteria.adultNum);
  this.flightSearchService.searchFlight?.get('passengers.child')?.setValue(searchCriteria.childNum);
  this.flightSearchService.searchFlight?.get('passengers.infant')?.setValue(searchCriteria.infantNum);

  let flights: string[] = [];

  searchCriteria.flights.forEach((e) => {
    const departingOnDate = new Date(e.departingOnDate);

    const formattedDate = departingOnDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });

    flights.push(e.departingFrom + '-' + e.arrivingTo + '-' + formattedDate);
  });  

  // NAVIGATE - This was missing!
  this.router.navigate([
    'flights-results',
    searchCriteria.language,
    searchCriteria.currency,
    searchCriteria.pos,
    searchCriteria.flightType,
    flights.join('_'),
    searchCriteria.searchId,
    'A-' + searchCriteria.adultNum + '-C-' + searchCriteria.childNum + '-I-' + searchCriteria.infantNum,
    searchCriteria.selectedFlightClass,
    searchCriteria.selectDirectFlightsOnly,
      'Airport_Airport'
  ]);
}
private convertSearchCriteriaToFormData(searchCriteria: any): any {
  const formData: any = {
    flightType: this.mapFlightType(searchCriteria.flightType),
    Direct: searchCriteria.selectDirectFlightsOnly,
    Flights: [],
    passengers: {
      adults: searchCriteria.adultNum,
      child: searchCriteria.childNum,
      infant: searchCriteria.infantNum
    },
    class: searchCriteria.selectedFlightClass
  };

  // Convert flights array to the expected format
  searchCriteria.flights.forEach((flight: any) => {
    formData.Flights.push({
      isDepartingSelected: false,
      isLandingSelected: false,
      departing: this.formatAirportString(flight.departingFrom),
      landing: this.formatAirportString(flight.arrivingTo),
      departingD: flight.departingOnDate
    });
  });

  // For roundtrip, add return date from the second flight if available
  if (searchCriteria.flightType.toLowerCase() === 'roundtrip' && formData.Flights.length > 1) {
    formData.returnDate = formData.Flights[1].departingD;
  }

  return formData;
}

private mapFlightType(flightType: string): string {
  const typeMap: { [key: string]: string } = {
    'Oneway': 'OneWay',
    'Roundtrip': 'RoundTrip',
    'Multicity': 'MultiCity'
  };
  return typeMap[flightType] || 'RoundTrip';
}

private formatAirportString(airportCode: string): string {
  // This is a placeholder - you might need to get the actual city name
  // from your airport data service
  return `${airportCode},${airportCode}`;
}

private storeAirportData(searchCriteria: any): void {
  const departing: string[] = [];
  const landing: string[] = [];

  searchCriteria.flights.forEach((flight: any) => {
    departing.push(flight.departingFrom);
    landing.push(flight.arrivingTo);
  });

  // localStorage.setItem('departing', JSON.stringify(departing));
  // localStorage.setItem('landing', JSON.stringify(landing));
}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.sharedService.isPaymentModalShowed = false;
    sessionStorage.removeItem('selectedTicket');
  }
}
