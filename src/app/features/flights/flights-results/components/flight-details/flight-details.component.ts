import { Location } from '@angular/common';
import { Component, DestroyRef, Inject, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FlightCheckoutService, FlightResultService, IBaggageInformation, ISearchCriteria } from 'rp-travel-ui';
import { Subscription } from 'rxjs';
import { FlightSharedService } from '../../../../../core/services/flightShared.service';
import { SharedService } from '../../../../../shared/shared.service';

@Component({
  selector: 'app-flight-details',
  templateUrl: './flight-details.component.html',
  styleUrl: './flight-details.component.scss',
})
export class FlightDetailsComponent implements OnInit, OnDestroy {
  public flightResultService = inject(FlightResultService);
  public flightSharedService = inject(FlightSharedService);
  public flightCheckoutService = inject(FlightCheckoutService);
  public location = inject(Location);
  public sharedService = inject(SharedService);

  private destroyRef = inject(DestroyRef);
  searchCriteria!: ISearchCriteria;
  selectedTab = 'details';

  constructor(@Inject(MAT_DIALOG_DATA) public data: { searchCriteria: ISearchCriteria; dismiss: Function }) {
    this.searchCriteria = data.searchCriteria;
  }

  ngOnInit(): void {
    const searchId = this.flightResultService.searchID || this.flightCheckoutService.selectedFlight?.searchCriteria.searchId || '';
    const sequenceNum = this.sharedService.selectedFlightItinerary.sequenceNum;
    const pKey = this.sharedService.selectedFlightItinerary.pKey;
    const pcc = this.sharedService.selectedFlightItinerary.pcc ?? '';

    const subscription = this.flightResultService.brandedFareNotifier.subscribe({
      next: () => {
        if(searchId && sequenceNum && pKey){
          this.flightResultService.showFareRules(searchId,sequenceNum,pKey)
        }
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });

    this.flightResultService.getBrandedFares(
      searchId,
      sequenceNum,
      pKey,
      pcc,
    );
  }

  closeDialog() {
    this.data.dismiss();
  }
  baggageInfo: IBaggageInformation = this.sharedService.selectedFlightItinerary.baggageInformation[0];

  get normalBaggage() {
    const baggage = this.baggageInfo.baggage.split(' ');

    if (baggage[1] === 'Kilograms') {
      return Math.floor(parseInt(baggage[0]) / 7);
    }

    return baggage[0];
  }

  get getUnit() {
    const baggage = this.baggageInfo.baggage.split(' ');

    if (baggage[1] === 'Kilograms') {
      return 'KGs';
    }

    return 'PCs';
  }

  adultBaggage() {
    const baggage = this.baggageInfo.baggage.split(' ');

    if (baggage[1] === 'Kilograms') {
      return Math.floor(parseInt(baggage[0]) / 7);
    }

    return baggage[0];
  }

  childBaggage() {
    const baggage = this.baggageInfo.childBaggage?.split(' ');

    if (baggage) {
      if (baggage[1] === 'Kilograms') {
        return Math.floor(parseInt(baggage[0]) / 7);
      }

      return baggage[0];
    }

    return 'N/A';
  }

  infantBaggage() {
    const baggage = this.baggageInfo.infantBaggage?.split(' ');

    if (baggage) {
      if (baggage[1] === 'Kilograms') {
        return Math.floor(parseInt(baggage[0]) / 7);
      }

      return baggage[0];
    }

    return 'N/A';
  }

  ngOnDestroy(): void {
    this.sharedService.selectedItinerary = -1;
  }
}
