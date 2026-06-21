import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Brand, FlightCheckoutService, FlightResultService, IAirItinerary } from 'rp-travel-ui';
import { SharedService } from '../../../../../shared/shared.service';
import { FlightSharedService } from '../../../../../core/services/flightShared.service';
import { MatDialog } from '@angular/material/dialog';
import { FlightDetailsComponent } from '../../../flights-results/components/flight-details/flight-details.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrl: './step-two.component.scss',
})
export class StepTwoComponent implements OnInit {
  @Output() contactFormSubmitted = new EventEmitter<{ email: string; phone: string; country: string } | null>();

  public sharedService = inject(SharedService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private flightCheckoutService = inject(FlightCheckoutService);
  private flightResultService = inject(FlightResultService);
  private flightSharedService = inject(FlightSharedService);
  private dialog = inject(MatDialog);
  public translate = inject(TranslateService)
  flightData?: any;
  airItineraries?: IAirItinerary;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const sid = params['sid'];
      const sequenceNum = params['sequenceNum'];
      const providerKey = params['providerKey'] || params['pkey'];
      const brandId = params['brandId'];

      if (!sid || !sequenceNum || !providerKey) {
        this.redirectToStepOne(params);
        return;
      }

      const searchId = sid.split('_')[0];
      const pcc = sid.split('_')[1] || '';

      const flightKey = `flightData_${searchId}_${sequenceNum}_${providerKey}`;
      const brandsKey = `${searchId}${sequenceNum}${providerKey}${pcc}`;
      const selectedTicket = sessionStorage.getItem('selectedTicket');
      const flightData = sessionStorage.getItem(flightKey);
      const brandsData = sessionStorage.getItem(brandsKey);
      // if (!selectedTicket || !flightData || !brandsData) {
      //   this.redirectToStepOne(params);
      //   return;
      // }

      // Get airItineraries from sessionStorage
      this.getAirItinerariesFromSession(searchId, sequenceNum, providerKey);
      this.getFlightDataFromSession(searchId, sequenceNum, providerKey);

      this.flightResultService.getBrandedFares(searchId, sequenceNum, providerKey, pcc);
      const brandIndex = this.flightResultService.currentSelectedBrands.findIndex( brand => brand.brandId === brandId);

      if(brandIndex !== -1) {
        this.sharedService.selectedBrandedIndex = brandIndex;
      } else {
        this.sharedService.selectedBrandedIndex = 0;
      }
    });
  }

  private getAirItinerariesFromSession(searchId: string, sequenceNum: string, providerKey: string): void {
    const airItinerariesKey = this.getAirItinerariesStorageKey(searchId, sequenceNum, providerKey);
    const airItinerariesData = sessionStorage.getItem(airItinerariesKey);
    if (airItinerariesData) {
      this.airItineraries = JSON.parse(airItinerariesData);
    }
  }
  private getFlightDataFromSession(searchId: string, sequenceNum: string, providerKey: string): void {
    const flightDataKey = this.getFlightDataStorageKey(searchId, sequenceNum, providerKey);
    const flightData = sessionStorage.getItem(flightDataKey);
    if (flightData) {
      this.flightData = JSON.parse(flightData);
      this.flightCheckoutService.selectedFlight = this.flightData;
      this.flightCheckoutService.selectedFlightLang.next(null);
    }
  }

  private getAirItinerariesStorageKey(searchId: string, sequenceNum: string, providerKey: string): string {
    return `flightData_AIR_ITINERARIES_${searchId}_${sequenceNum}_${providerKey}`;
  }
  private getFlightDataStorageKey(searchId: string, sequenceNum: string, providerKey: string): string {
    return `flightData_${searchId}_${sequenceNum}_${providerKey}`;
  }

  private redirectToStepOne(params: any) {
    const sid = params['sid'].split('_')[0];
    const sequenceNum = params['sequenceNum'];
    const providerKey = params['providerKey'] || params['pkey'];
    const pcc = params['sid'].split('_')[1] || '';

    // Clear relevant sessionStorage items
    const flightKey = `flightData_${sid}_${sequenceNum}_${providerKey}`;
    const brandsKey = `${sid}${sequenceNum}${providerKey}${pcc}`;
    const airItinerariesKey = this.getAirItinerariesStorageKey(sid, sequenceNum, providerKey);

    sessionStorage.removeItem('selectedTicket');
    sessionStorage.removeItem(flightKey);
    sessionStorage.removeItem(brandsKey);
    sessionStorage.removeItem(airItinerariesKey);

    this.router.navigate(['/flights-checkout/step-one'], {
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }

  goToFlightDetails(selectedFlight: IAirItinerary[]) {
    this.flightSharedService.selectedFlight = selectedFlight;
    this.sharedService.selectedFlightItinerary = selectedFlight[0];

    this.dialog.open(FlightDetailsComponent, {
      data: {
        dismiss: () => this.dialog.closeAll(),
      },
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      hasBackdrop: true,
    });
  }

  onContactDataChanged(data: { email: string; phone: string; country: string } | null) {
    if (data) {
      this.contactFormSubmitted.emit(data);
    }
  }
}
