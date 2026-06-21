import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from '../../../../../../../shared/shared.module';
import { FlightCheckoutService , FlightResultService } from 'rp-travel-ui';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../../../../../../shared/shared.service';
@Component({
  selector: 'app-fare-breakdown',
  templateUrl: './fare-breakdown.component.html',
  styleUrl: './fare-breakdown.component.scss',
})
export class FareBreakdownComponent implements OnInit {
  private readonly SESSION_STORAGE_FLIGHT_PREFIX = 'flightData_';
  private readonly SESSION_STORAGE_SELECTED_TICKET = 'selectedTicket';

  private translate = inject(TranslateService);
  private route = inject(ActivatedRoute);
  public flightCheckoutService = inject(FlightCheckoutService);
  public flightresult = inject(FlightResultService);
  public sharedService = inject(SharedService);

  selectedTicket?: string;
  selectedFlight: any = null;
  selectedBrands: any = null;
  currentLang = this.translate.currentLang;
  selectedOption: number | null = null;
  checked: boolean = false;
  brandedFareId!: number;

  searchParams: any = {};
  brand: any;
  discountValue: number = 0;
  serviceChargeValue: number = 0;
  discountValueBranded: number = 0;
  serviceChargeValueBranded: number = 0;

  isLoading: boolean = true;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.searchParams = {
        searchId: params['sid']?.split('_')[0],
        sequenceNum: params['sequenceNum'],
        providerKey: params['providerKey'] || params['pkey'],
        pcc: params['sid']?.split('_')[1],
      };
      this.loadFlightData();
    });
    // this.flightCheckoutService.calculatePassengersFareBreakupValue()
  }

  private getFlightDataKey(): string {
    return `${this.SESSION_STORAGE_FLIGHT_PREFIX}${this.searchParams.searchId}_${this.searchParams.sequenceNum}_${this.searchParams.providerKey}`;
  }

  private getBrandedFaresKey(): string {
    return `${this.searchParams.searchId}${this.searchParams.sequenceNum}${this.searchParams.providerKey}${this.searchParams.pcc}`;
  }

  private loadFlightData(): void {
    this.isLoading = true;

    if (!this.searchParams) {
      this.isLoading = false;
      return;
    }

    // Step 1: Try sessionStorage
    const ticket = sessionStorage.getItem(this.SESSION_STORAGE_SELECTED_TICKET);
    this.selectedTicket = ticket || undefined;

    const flightKey = this.getFlightDataKey();
    const brandsKey = this.getBrandedFaresKey();

    const cachedFlight = sessionStorage.getItem(flightKey);
    const cachedBrands = sessionStorage.getItem(brandsKey);

    if (this.flightCheckoutService.selectedFlight) {
      this.selectedFlight = this.flightCheckoutService.selectedFlight;

      this.loadBrandsAndCalculate(cachedBrands);
      return;
    }

    if (cachedFlight) {
      this.selectedFlight = JSON.parse(cachedFlight);
      this.flightCheckoutService.selectedFlight = this.selectedFlight;
      this.loadBrandsAndCalculate(cachedBrands);
      return;
    }

    // Step 2: Check sharedService
    if (this.sharedService.selectedFlight) {
      this.selectedFlight = this.sharedService.selectedFlight;
      this.flightCheckoutService.selectedFlight = this.selectedFlight;
      this.loadBrandsAndCalculate(cachedBrands);
      return;
    }

    // Step 4: Fetch from API
    this.fetchFlightDataFromApi();
  }

  private loadBrandsAndCalculate(brandsData: string | null): void {
    if (brandsData) {
      try {
        this.selectedBrands = JSON.parse(brandsData);
        const businessBrand = this.selectedBrands?.find(
          (brand: any) =>
            brand.itinTotalFare.amount > this.selectedBrands[0].itinTotalFare.amount && brand.isRefundable === true,
        );
        this.brand = businessBrand;
        this.getBrandedDiscountValue();
      } catch (e) {
        console.error('Error parsing branded fares', e);
      }
    }

    this.getDiscountValue();
    this.isLoading = false;
  }

  private fetchFlightDataFromApi(): void {
    const { searchId, sequenceNum, providerKey, pcc } = this.searchParams;

    this.flightCheckoutService.getSelectedFlightData(searchId, sequenceNum, providerKey, false, pcc);
    this.flightCheckoutService.notify.subscribe({
      next: (data: any) => {
        this.selectedFlight = data;
        this.flightCheckoutService.selectedFlight = data;

        // Optional: Cache it
        const key = this.getFlightDataKey();
        sessionStorage.setItem(key, JSON.stringify(data));

        this.getDiscountValue();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load flight data from API', err);
        this.isLoading = false;
      },
    });
  }

  getDiscountValue() {
    if (
      !this.selectedFlight?.airItineraryDTO?.itinTotalFare ||
      !this.selectedFlight?.airItineraryDTO?.passengerFareBreakDownDTOs
    ) {
      this.discountValue = 0;
      this.serviceChargeValue = 0;
      return;
    }

    const itinTotalFare = this.selectedFlight.airItineraryDTO.itinTotalFare;

    const totalPassengerFare = this.selectedFlight.airItineraryDTO.passengerFareBreakDownDTOs.reduce(
      (
        total: number,
        passenger: {
          passengerQuantity: number;
          flightFaresDTOs: { fareType: string; fareAmount: number }[];
        },
      ) => {
        if (!passenger.flightFaresDTOs) return total;

        const totalFarePerPassenger = passenger.flightFaresDTOs
          .filter((fare) => fare.fareType === 'TotalFare')
          .reduce((sum: number, fare) => sum + (fare.fareAmount || 0), 0);

        return total + totalFarePerPassenger * (passenger.passengerQuantity || 1);
      },
      0,
    );

    const displayedFare = itinTotalFare.amount || 0;

    if (displayedFare < totalPassengerFare) {
      this.discountValue = totalPassengerFare - displayedFare;
      this.serviceChargeValue = 0;
    } else if (displayedFare > totalPassengerFare) {
      this.serviceChargeValue = displayedFare - totalPassengerFare;
      this.discountValue = 0;
    } else {
      this.discountValue = 0;
      this.serviceChargeValue = 0;
    }
  }

  getBrandedDiscountValue() {
    if (!this.brand?.itinTotalFare || !this.brand?.passengerFareBreakDowns) {
      this.discountValueBranded = 0;
      this.serviceChargeValueBranded = 0;
      return;
    }

    const itinTotalFare = this.brand.itinTotalFare;

    const totalPassengerFare = this.brand.passengerFareBreakDowns.reduce(
      (
        total: number,
        passenger: {
          passengerQuantity: number;
          flightFaresDTOs: { fareType: string; fareAmount: number }[];
        },
      ) => {
        if (!passenger.flightFaresDTOs) return total;

        const totalFarePerPassenger = passenger.flightFaresDTOs
          .filter((fare) => fare.fareType === 'TotalFare')
          .reduce((sum: number, fare) => sum + (fare.fareAmount || 0), 0);

        return total + totalFarePerPassenger * (passenger.passengerQuantity || 1);
      },
      0,
    );

    const displayedFare = itinTotalFare.amount || 0;

    if (displayedFare < totalPassengerFare) {
      this.discountValueBranded = totalPassengerFare - displayedFare;
      this.serviceChargeValueBranded = 0;
    } else if (displayedFare > totalPassengerFare) {
      this.serviceChargeValueBranded = displayedFare - totalPassengerFare;
      this.discountValueBranded = 0;
    } else {
      this.discountValueBranded = 0;
      this.serviceChargeValueBranded = 0;
    }
  }
  translateFlightType(type: string | undefined): string {
  if (this.currentLang === 'ar') {
    switch (type?.toLowerCase()) {
      case 'roundtrip':
        return 'ذهاب وعودة';
      case 'oneway':
        return 'اتجاه واحد';
      case 'multicity':
        return 'مدن متعددة';
      default:
        return type ?? '';
    }
  }
  return type ?? '';
}
}
