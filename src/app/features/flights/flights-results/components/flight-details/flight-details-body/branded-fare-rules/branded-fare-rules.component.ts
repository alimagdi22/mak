import { FlightFareDTO } from './../../../../../../home/components/most-searched-flights/interfaces';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FlightResultService, IPassengerFareBreakDownDTO, PassengerFareBreakDown } from 'rp-travel-ui';
import { SharedService } from '../../../../../../../shared/shared.service';

@Component({
  selector: 'app-branded-fare-rules',
  templateUrl: './branded-fare-rules.component.html',
  styleUrl: './branded-fare-rules.component.scss',
})
export class BrandedFareRulesComponent implements OnInit {
  flightResultService = inject(FlightResultService);
  sharedService = inject(SharedService);
  public showFares = false;
  public sectors: string[] = [];

  ngOnInit(): void {
    console.log(this.sharedService.selectedBrandedIndex);
    console.log(this.sharedService.selectedFlightItinerary);

    this.sharedService.selectedFlightItinerary.allJourney.flights.forEach((flight, index) => {
      const departureAirportCode = flight.flightDTO[0].departureTerminalAirport.airportCode;
      const arrivalAirportCode = flight.flightDTO[flight.flightDTO.length - 1].arrivalTerminalAirport.airportCode;

      this.sectors[index] = departureAirportCode + '-' + arrivalAirportCode;
    });
  }

  getTotelBaseFare() {
    let totalBaseFare = 0;

    if (!this.isBrandedFare) {
      totalBaseFare = this.sharedService.selectedFlightItinerary.itinTotalFare.amount;

      return totalBaseFare;
    }

    totalBaseFare =
      this.flightResultService.currentSelectedBrands[this.sharedService.selectedBrandedIndex].itinTotalFare.amount;

    return totalBaseFare;
  }

  getTotelTaxFare() {
    let totalTaxFare = 0;

    if (!this.isBrandedFare) {
      this.sharedService.selectedFlightItinerary.passengerFareBreakDownDTOs?.forEach((e: any) => {
        totalTaxFare += e.flightFaresDTOs[3].fareAmount * e.passengerQuantity;
      });
      this.sharedService.selectedFlightItinerary.itinTotalFare.mValue;

      return totalTaxFare;
    }

    totalTaxFare =
      this.flightResultService.currentSelectedBrands[this.sharedService.selectedBrandedIndex].itinTotalFare.totalTaxes;

    return totalTaxFare;
  }

  getCancellationPrice() {
    let totalCancellationPrice = 0;

    if (!this.isBrandedFare) {
      totalCancellationPrice =
        this.sharedService.selectedFlightItinerary.passengerFareBreakDownDTOs[0].cancelPenaltyDTOs[0].price;

      return totalCancellationPrice;
    }

    totalCancellationPrice =
      this.flightResultService.currentSelectedBrands[this.sharedService.selectedBrandedIndex].passengerFareBreakDowns[0]
        .cancelPenaltyDTOs[0].price;

    return totalCancellationPrice;
  }

  getChangePrice() {
    let totalChangePrice = 0;

    if (!this.isBrandedFare) {
      totalChangePrice =
        this.sharedService.selectedFlightItinerary.passengerFareBreakDownDTOs[0].changePenaltyDTOs[0].price;

      return totalChangePrice;
    }

    totalChangePrice =
      this.flightResultService.currentSelectedBrands[this.sharedService.selectedBrandedIndex].passengerFareBreakDowns[0]
        .changePenaltyDTOs[0].price;

    return totalChangePrice;
  }

  getAdultTotalFare(passengerFareBreakDown: PassengerFareBreakDown | IPassengerFareBreakDownDTO) {
    const baseFareIndex = passengerFareBreakDown.flightFaresDTOs.findIndex(
      (flightFare) => flightFare.fareType.toLowerCase() === 'basefare',
    );

    if (passengerFareBreakDown.passengerType !== 'ADT') {
      return passengerFareBreakDown.flightFaresDTOs[baseFareIndex].fareAmount;
    }

    if (this.isBrandedFare) {
      let markUpValueForEachAdult =
        (this.flightResultService.currentSelectedBrands[this.sharedService.selectedBrandedIndex].itinTotalFare.mValue ??
          0) / passengerFareBreakDown.passengerQuantity;

      return markUpValueForEachAdult + passengerFareBreakDown.flightFaresDTOs[baseFareIndex].fareAmount;
    }

    let markUpValueForEachAdult =
      (this.sharedService.selectedFlightItinerary.itinTotalFare.mValue ?? 0) / passengerFareBreakDown.passengerQuantity;

    return markUpValueForEachAdult + passengerFareBreakDown.flightFaresDTOs[baseFareIndex].fareAmount;
  }

  getDiscount() {
    if (this.isBrandedFare) {
      return this.flightResultService.currentSelectedBrands[this.sharedService.selectedBrandedIndex].itinTotalFare
        .dValue;
    }

    return this.sharedService.selectedFlightItinerary.itinTotalFare.dValue;
  }

  get isBrandedFare() {
    return this.flightResultService.currentSelectedBrands[this.sharedService.selectedBrandedIndex];
  }

  get isRefundable() {
    return this.sharedService.selectedFlightItinerary.isRefundable;
  }
}
