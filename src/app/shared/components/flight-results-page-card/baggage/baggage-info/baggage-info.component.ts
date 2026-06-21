import { NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BAGGAGE_INFORMATION_DEFAULT, FlightResultService, IBaggageInformation, IFlight } from 'rp-travel-ui';
import { SharedService } from '../../../../shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { take } from 'rxjs';

@Component({
  selector: 'app-baggage-info',
  standalone: true,
  imports: [NgStyle, TranslateModule, NgFor, NgIf, MatProgressSpinnerModule],
  templateUrl: './baggage-info.component.html',
  styleUrl: './baggage-info.component.scss',
})
export class BaggageInfoComponent implements OnInit {
  @Input() baggageInfo: IBaggageInformation = BAGGAGE_INFORMATION_DEFAULT;
  @Input() padding = 0;
  @Input() searchCriteria?: any;
  @Input() flight!:any;
  private _flight!: IFlight;
  @Input({ required: true })
  
  @Input() index!: number;
  private route = inject(ActivatedRoute);
  private router: Router = inject(Router)
  public translate = inject(TranslateService);
  public sharedService = inject(SharedService)
  public flightResultService = inject(FlightResultService);
  private destroyRef = inject(DestroyRef);
  searchParams: any;
  selectedBrands: any = null;
  private readonly SESSION_STORAGE_SELECTED_TICKET = 'selectedTicket';
  ticketType: 'branded' | 'standard' | null = null;
  selectedBrand: any;
  hasStepTwo: boolean = false;

  private brandedFareSubscriptionCreated = false;
  private lastBrandedFaresRequestKey?: string;
  private flightRouteCache = new Map<number, string>();
  private lastShowFareRulesCall = 0;
  private readonly SHOW_FARE_RULES_COOLDOWN_MS = 300; // ms

  ngOnInit(): void {
    if (this.sharedService.searchParams) {
      // compute request key for de-dup
      const sid = this.sharedService.searchParams['searchId'];
      const seq = this.sharedService.selectedCardData?.[0]?.sequenceNum ?? this.sharedService.selectedCardData?.[0]?.sequenceNum;
      const pKey = this.sharedService.selectedCardData?.[0]?.pKey;
      const pcc = this.sharedService.selectedCardData?.[0]?.pcc;
      const requestKey = `${sid}_${seq}_${pKey}_${pcc}`;

      // ensure single subscription
      this.ensureBrandedFareSubscription();

      // call getBrandedFares only if not already requested
      if (this.lastBrandedFaresRequestKey !== requestKey && !this.flightResultService.isBrandedFaresLoading) {
        this.lastBrandedFaresRequestKey = requestKey;
        this.flightResultService.getBrandedFares(
          sid,
          seq,
          pKey,
          pcc,
        );
      }
    }

    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      const sid = params['sid'];
      const sequenceNum = params['sequenceNum'];
      const providerKey = params['providerKey'] || params['pkey'];
      if (!sid || !sequenceNum || !providerKey) {
        return;
      }

      const searchId = sid.split('_')[0];
      const pcc = sid.split('_')[1] || '';
      const flightKey = `flightData_${searchId}_${sequenceNum}_${providerKey}`;
      const flightData = sessionStorage.getItem(flightKey);

      this.searchParams = {
        searchId: params['sid']?.split('_')[0],
        sequenceNum: params['sequenceNum'],
        providerKey: params['providerKey'] || params['pkey'],
        pcc: params['sid']?.split('_')[1],
      };
      if (flightData) {
        const data = JSON.parse(flightData);
        this.searchCriteria = data.searchCriteria;
      } else {
        console.warn(`No flight data found for key: ${flightKey}`);
      }

      // create subscription once
      this.ensureBrandedFareSubscription();

      // de-duplicate getBrandedFares calls using a key and loading flag
      const requestKey = `${this.searchParams.searchId}_${this.searchParams.sequenceNum}_${this.searchParams.providerKey}_${this.searchParams.pcc}`;
      if (this.lastBrandedFaresRequestKey !== requestKey && !this.flightResultService.isBrandedFaresLoading) {
        this.lastBrandedFaresRequestKey = requestKey;
        this.flightResultService.getBrandedFares(
          this.searchParams.searchId, this.searchParams.sequenceNum, this.searchParams.providerKey,
          this.searchParams.pcc,
        );
      }

      this.loadBrandedFaresData();
      this.prepareFareDetails();
      this.loadSelectedTicket();
      this.hasStepTwo = this.router.url.includes('step-two');
    });
  }

  set flights(value: IFlight) {
    this._flight = value;
    this.flightRouteCache.clear();
  }
  get flights(): IFlight {
    return this._flight;
  }


  private ensureBrandedFareSubscription(): void {
    if (this.brandedFareSubscriptionCreated) return;
    this.brandedFareSubscriptionCreated = true;

    const subscription = this.flightResultService.brandedFareNotifier.subscribe({
      next: () => {
        // small cooldown to avoid immediate repeated/recursive calls
        const now = Date.now();
        if (now - this.lastShowFareRulesCall < this.SHOW_FARE_RULES_COOLDOWN_MS) return;
        this.lastShowFareRulesCall = now;

        // try to resolve params from searchParams first, fall back to sharedService
        const searchId = this.searchParams?.searchId ?? this.sharedService.searchParams?.['searchId'];
        const sequenceNum = this.searchParams?.sequenceNum ?? this.sharedService.selectedCardData?.[0]?.sequenceNum ?? this.sharedService.selectedCardData?.[0]?.sequenceNum;
        const providerKey = this.searchParams?.providerKey ?? this.sharedService.selectedCardData?.[0]?.pKey;

        if (!searchId || !sequenceNum || !providerKey) return;

        this.flightResultService.showFareRules(searchId, sequenceNum, providerKey);
      },
      error: (err) => {
        console.error('brandedFareNotifier error', err);
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  private loadSelectedTicket(): void {
    const ticket = sessionStorage.getItem(this.SESSION_STORAGE_SELECTED_TICKET);
    if (ticket === 'branded' || ticket === 'standard') {
      this.ticketType = ticket;
    }
  }

  private loadBrandedFaresData(): void {
    const key = this.getBrandedFaresKey();
    const data = sessionStorage.getItem(key);
    if (data) {
      this.selectedBrands = JSON.parse(data);
    } else {
      // determine parameters (try sharedService first, then fallback to searchParams)
      const searchId = this.sharedService.searchParams?.['searchId'] ?? this.searchParams?.searchId;
      const seq = this.sharedService.selectedCardData?.[0]?.sequenceNum ?? this.sharedService.selectedCardData?.[0]?.sequenceNum ?? this.searchParams?.sequenceNum;
      const pKey = this.sharedService.selectedCardData?.[0]?.pKey ?? this.searchParams?.providerKey;
      const pcc = this.sharedService.selectedCardData?.[0]?.pcc ?? this.searchParams?.pcc;
      const requestKey = `${searchId}_${seq}_${pKey}_${pcc}`;

      // only request if not already requested and not currently loading
      if (this.lastBrandedFaresRequestKey !== requestKey && !this.flightResultService.isBrandedFaresLoading) {
        this.lastBrandedFaresRequestKey = requestKey;
        this.ensureBrandedFareSubscription();
        this.flightResultService.getBrandedFares(searchId, seq, pKey, pcc);
      }
    }
  }

  private getBrandedFaresKey(): string {
    const { searchId, sequenceNum, providerKey, pcc } = this.searchParams;
    return `${searchId}${sequenceNum}${providerKey}${pcc}`;
  }

  private prepareFareDetails(): void {
    if (this.selectedBrands) {
      const businessBrand = this.selectedBrands.find(
        (brand: any) =>
          brand.itinTotalFare.amount > this.selectedBrands[0].itinTotalFare.amount && brand.isRefundable === true,
      );
      this.selectedBrand = businessBrand;
    }
  }

  getPassengerCount(type: 'adultNum' | 'childNum' | 'infantNum'): number {
    return this.searchCriteria?.[type] ?? this.flightResultService.response?.searchCriteria?.[type] ?? 0;
  }

  getBaggageCountOnlyOrRaw(baggage: string): string {
    if (!baggage) return '';

    const [countStr, unit] = baggage.split(' ');

    const isPieceUnit = ['Piece', 'Pieces', 'PC', 'Pcs'].includes(unit);
    const isKgUnit = ['KG', 'Kg', 'kg'].includes(unit);

    if (isPieceUnit) {
      if (countStr === "0") {
        return '0';
      }
      return `${countStr} x <strong>${this.translate.instant('checkout.payment.checked')}</strong> 23KG`;
    }

    if (isKgUnit) {
      return `${countStr} x <strong>${this.translate.instant('checkout.payment.checked')}</strong> KG`;
    }

    return baggage;
  }

  /** Get passenger type specific baggage allowance for LEGACY (non-branded) **/
  getPassengerBaggageAllowance(passengerType: string): any {
    const baggageInfo = this.flightResultService?.baggageInfo;
    if (!baggageInfo || baggageInfo.length === 0) return null;

    for (const baggage of baggageInfo) {
      if (baggage.paxType === this.getPaxTypeCode(passengerType)) {
        return baggage;
      }
    }

    return null;
  }

  /** Get passenger type specific baggage allowance for BRANDED fares **/
  getBrandedPassengerBaggageAllowance(passengerType: string): any[] {
    const baggageAllowances = this.selectedBrand?.baggageAllowances;
    if (!baggageAllowances || !Array.isArray(baggageAllowances)) return [];

    return baggageAllowances.filter((baggage: any) =>
      baggage.paxType === this.getPaxTypeCode(passengerType)
    );
  }

  /** Get passenger type code **/
  private getPaxTypeCode(passengerType: string): string {
    switch (passengerType) {
      case 'ADT': return 'ADT';
      case 'CHD': return 'CHD';
      case 'INF': return 'INF';
      default: return 'ADT';
    }
  }

  /** BRANDED fares baggage count **/
  getBrandedBaggageCount(index: number, passengerType: string): string {
    const passengerBaggageList = this.getBrandedPassengerBaggageAllowance(passengerType);
    if (!passengerBaggageList || passengerBaggageList.length === 0) return '';

    const flightRoute = this.getFlightRoute(index);

    for (const passengerBaggage of passengerBaggageList) {
      if (!passengerBaggage.baggageAllowanceDetails) continue;

      const baggageDetails = passengerBaggage.baggageAllowanceDetails;
      let detail;

      // Try exact route match first
      if (flightRoute) {
        detail = baggageDetails.find((d: any) => d.flightRoute === flightRoute);
      }

      // Try by index
      if (!detail && baggageDetails.length > index) {
        detail = baggageDetails[index];
      }

      // Use first available
      if (!detail && baggageDetails.length > 0) {
        detail = baggageDetails[0];
      }

      if (detail) {
        return this.formatBaggageInfo(detail.baggageAllowanceInfo);
      }
    }

    return '';
  }

  /** LEGACY fares baggage count **/
  getBaggageCount(index: number, passengerType: string): string {
    const passengerBaggage = this.getPassengerBaggageAllowance(passengerType);
    if (!passengerBaggage || !passengerBaggage.baggageAllowanceDetails) return '';

    const flightRoute = this.getFlightRoute(index);
    const baggageDetails = passengerBaggage.baggageAllowanceDetails;

    let detail;

    // Try to find exact route match first
    if (flightRoute) {
      detail = baggageDetails.find((d: any) => d.flightRoute === flightRoute);
    }

    // If no exact match, try to find by index
    if (!detail && baggageDetails.length > index) {
      detail = baggageDetails[index];
    }

    // If still no match, use first available
    if (!detail && baggageDetails.length > 0) {
      detail = baggageDetails[0];
    }

    if (!detail) return '';

    return this.formatBaggageInfo(detail.baggageAllowanceInfo);
  }

  /** Common method to format baggage information **/
  private formatBaggageInfo(baggageInfo: any): string {
    if (!baggageInfo) return '';

    const unit = (baggageInfo.unit || '').toUpperCase();
    const size = baggageInfo.size;

    if (unit.startsWith('KG')) return baggageInfo.numberOfPeices? `${baggageInfo.numberOfPeices} X ${size} KG` : `${size} KG`;

    const pieceUnits = ['PIECE', 'PIECES', 'PC', 'PCS', 'Pcs', 'Pc'];
    if (pieceUnits.includes(unit)) {
      const count = parseInt(size as any, 10);
      if (!count || count === 0) return '0';
      return `${count} x <strong>${this.translate.instant('checkout.payment.checked')}</strong> 23KG`;
    }
    return baggageInfo.numberOfPeices ? `${baggageInfo.numberOfPeices} X ${size} ${baggageInfo.unit || ''}`.trim() : `${size} ${baggageInfo.unit || ''}`.trim();
  }

  // memoized flight route getter to avoid repeated computation/logging from template change detection
  private getFlightRoute(index: number): string {
    if (this.flightRouteCache.has(index)) {
      return this.flightRouteCache.get(index)!;
    }

    // First try: get from shared service
    const flights = this.sharedService.selectedFlightItinerary?.allJourney?.flights;
    let route = '';
    if (flights && flights[index]) {
      const item = flights[index];
      const departureCity = item.flightDTO[0].departureTerminalAirport.cityCode;
      const arrivalCity = item.flightDTO[item.flightDTO.length - 1].arrivalTerminalAirport.cityCode;
      route = `${departureCity}-${arrivalCity}`;
      this.flightRouteCache.set(index, route);
      return route;
    }

    // Second try: get from flight input (current component input)
    if (this.flights && this.flights.flightDTO && this.flights.flightDTO.length > 0) {
      const departureCity = this.flights.flightDTO[0].departureTerminalAirport.cityCode;
      const arrivalCity = this.flights.flightDTO[this.flights.flightDTO.length - 1].arrivalTerminalAirport.cityCode;
      route = `${departureCity}-${arrivalCity}`;
      this.flightRouteCache.set(index, route);
      return route;
    }

    // Third try: extract from baggageInfo flightRoute (parse the first available route)
    if (this.flightResultService.baggageInfo && this.flightResultService.baggageInfo.length > 0) {
      const firstBaggage = this.flightResultService.baggageInfo[0];
      if (firstBaggage.baggageAllowanceDetails && firstBaggage.baggageAllowanceDetails.length > 0) {
        const detailIndex = Math.min(index, firstBaggage.baggageAllowanceDetails.length - 1);
        route = firstBaggage.baggageAllowanceDetails[detailIndex].flightRoute;
        
        this.flightRouteCache.set(index, route);
        return route;
      }
    }

    console.warn('Could not determine flight route for index:', index);
    this.flightRouteCache.set(index, '');
    return '';
  }

  /** Icon check for LEGACY fares **/
  isNoBaggageLegacy(index: number, passengerType: string): boolean {
    const passengerBaggage = this.getPassengerBaggageAllowance(passengerType);
    if (!passengerBaggage || !passengerBaggage.baggageAllowanceDetails) return true;

    const flightRoute = this.getFlightRoute(index);

    // Find the baggage detail for the specific flight route
    let detail;
    if (flightRoute) {
      detail = passengerBaggage.baggageAllowanceDetails.find((d: any) =>
        d.flightRoute === flightRoute
      );
    }

    // If no specific route found, try to find any detail
    if (!detail && passengerBaggage.baggageAllowanceDetails.length > 0) {
      detail = passengerBaggage.baggageAllowanceDetails[0];
    }

    if (detail) {
      const size = detail?.baggageAllowanceInfo?.size;
      const num = parseInt(size as any, 10);
      return !isNaN(num) && num === 0;
    }

    return true;
  }

  /** Icon check for BRANDED fares **/
  isNoBaggageBranded(index: number, passengerType: string): boolean {
    const passengerBaggageList = this.getBrandedPassengerBaggageAllowance(passengerType);
    if (!passengerBaggageList || passengerBaggageList.length === 0) return true;

    const flightRoute = this.getFlightRoute(index);

    for (const passengerBaggage of passengerBaggageList) {
      if (!passengerBaggage.baggageAllowanceDetails) continue;

      let detail;
      if (flightRoute) {
        detail = passengerBaggage.baggageAllowanceDetails.find((d: any) =>
          d.flightRoute === flightRoute
        );
      }

      if (!detail && passengerBaggage.baggageAllowanceDetails.length > 0) {
        detail = passengerBaggage.baggageAllowanceDetails[0];
      }

      if (detail) {
        const size = detail?.baggageAllowanceInfo?.size;
        const num = parseInt(size as any, 10);
        return !isNaN(num) && num === 0;
      }
    }

    return true;
  }

  /**
   * NEW helper: check if baggageInfo contains an entry for a given paxType
   * This is the only new method — used by the template instead of length checks.
   */
  public hasPaxType(paxType: string): boolean {
    const arr = this.flightResultService?.baggageInfo;
    if (!arr || !Array.isArray(arr)) return false;
    return arr.some((b: any) => (b?.paxType || '').toUpperCase() === (paxType || '').toUpperCase());
  }
}
