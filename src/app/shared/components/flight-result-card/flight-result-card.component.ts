import { DatePipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FlightResultService, IAirItinerary } from 'rp-travel-ui';
import { DurationFormatPipe } from '../../pipes/duration-format.pipe';
import { TimeFormatTransitPipe } from '../../pipes/time-format-transit.pipe';
import { TimeFormatPipe } from '../../pipes/time-format.pipe';
import { SharedService } from '../../shared.service';
import { BaggageComponent } from '../flight-results-page-card/baggage/baggage.component';
import { FlightResultCardDurationComponent } from './flight-result-card-duration/flight-result-card-duration.component';
import { FlightResultCardHeaderComponent } from './flight-result-card-header/flight-result-card-header.component';
import { FlightResultCardInfoComponent } from './flight-result-card-info/flight-result-card-info.component';
import { FlightResultCardStopsComponent } from './flight-result-card-stops/flight-result-card-stops.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-flight-result-card',
  standalone: true,
  imports: [
    TimeFormatPipe,
    TimeFormatTransitPipe,
    DurationFormatPipe,
    DatePipe,
    MatExpansionModule,
    TranslateModule,
    NgStyle,
    NgClass,
    NgFor,
    NgIf,
    FlightResultCardHeaderComponent,
    FlightResultCardInfoComponent,
    FlightResultCardDurationComponent,
    MatProgressSpinnerModule
    
  ],
  templateUrl: './flight-result-card.component.html',
  styleUrl: './flight-result-card.component.scss',
})
export class FlightResultCardComponent {
  @Input() details: IAirItinerary[] = [];
  @Input() showButtonMoreDetails: boolean = false;
  @Input() margin: string = '0';
  @Input() ShowBagsInDetails: boolean = false;
  @Input() showIconInDetails: boolean = false;
  @Input() isExpanded: boolean = true;
  @Input() searchCriteria?: any;
  @Input() showTag: boolean = false;

  public sharedService = inject(SharedService);
  public translate = inject(TranslateService);
  public flightResultService = inject(FlightResultService);
  public currentLang = this.translate.currentLang;
  private route = inject(ActivatedRoute);
  private router: Router = inject(Router)
  searchParams: any;
  selectedBrands: any = null;
  private readonly SESSION_STORAGE_SELECTED_TICKET = 'selectedTicket';
  ticketType: 'branded' | 'standard' | null = null;
  selectedBrand: any;
  hasStepTwo: boolean = false;

  cheapestJourney: any;


  togglePanel() {
    this.isExpanded = !this.isExpanded;
  }

  ngOnInit(){ 
    const journeys = this.details || [];

    this.cheapestJourney = journeys.reduce((min, curr) => {
      return curr.itinTotalFare?.amount < min.itinTotalFare?.amount ? curr : min;
    }, journeys[0]);

    this.route.queryParams.subscribe((params) => {
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
      this.loadBrandedFaresData();
      this.prepareFareDetails();
      this.loadSelectedTicket();
      this.hasStepTwo = this.router.url.includes('step-two');  
    });
  }
  translateCabinClass(cabin: string): string {
  if (this.currentLang === 'ar') {
    switch (cabin?.toLowerCase()) {
      case 'economy':
        return 'درجة سياحية';
      case 'first class':
        return 'الدرجة الأولى';
      case 'business':
        return 'درجة رجال الأعمال';
      default:
        return cabin; // fallback to original
    }
  }
  return cabin;
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

    }else{
      this.flightResultService.getBrandedFares(this.sharedService.searchParams['searchId'],this.sharedService.selectedCardData[0].segmentNums,this.sharedService.selectedCardData[0].pKey,this.sharedService.selectedCardData[0].pcc)
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
    switch(passengerType) {
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
    if (!flightRoute) return '';

    for (const passengerBaggage of passengerBaggageList) {
      if (!passengerBaggage.baggageAllowanceDetails) continue;
      
      const detail = passengerBaggage.baggageAllowanceDetails.find((detail: any) => 
        detail.flightRoute === flightRoute
      );
      
      if (detail) {
        return this.formatBaggageInfo(detail.baggageAllowanceInfo);
      }
    }

    const firstBaggage = passengerBaggageList[0];
    if (firstBaggage?.baggageAllowanceDetails?.[0]) {
      return this.formatBaggageInfo(firstBaggage.baggageAllowanceDetails[0].baggageAllowanceInfo);
    }

    return '';
  }

  /** LEGACY fares baggage count **/
  getBaggageCount(index: number, passengerType: string): string {
    const passengerBaggage = this.getPassengerBaggageAllowance(passengerType);
    if (!passengerBaggage || !passengerBaggage.baggageAllowanceDetails) return '';

    // Get the flight route for the current index
    const flightRoute = this.getFlightRoute(index);

    if (!flightRoute) {
      console.warn('No flight route found for index:', index);
      return '';
    }

    // Find the baggage detail for the specific flight route
    const detail = passengerBaggage.baggageAllowanceDetails.find((detail: any) => 
      detail.flightRoute === flightRoute
    );
    
    if (detail) {
      const result = this.formatBaggageInfo(detail.baggageAllowanceInfo);
      return result;
    }

    // If no exact route match, try to find by index position
    if (passengerBaggage.baggageAllowanceDetails.length > index) {
      const detailByIndex = passengerBaggage.baggageAllowanceDetails[index];
      const result = this.formatBaggageInfo(detailByIndex.baggageAllowanceInfo);
      return result;
    }

    // Fallback to first available
    if (passengerBaggage.baggageAllowanceDetails.length > 0) {
      const firstDetail = passengerBaggage.baggageAllowanceDetails[0];
      const result = this.formatBaggageInfo(firstDetail.baggageAllowanceInfo);
      return result;
    }

    console.warn('No baggage detail found for passenger:', passengerType, 'index:', index);
    return '';
  }

  /** Common method to format baggage information **/
  private formatBaggageInfo(baggageInfo: any): string {
    if (!baggageInfo) return '';
    
    const unit = (baggageInfo.unit || '').toUpperCase();
    const size = baggageInfo.size;

    if (unit.startsWith('KG')) return baggageInfo.numberOfPeices ? `${baggageInfo.numberOfPeices} X ${size} KG` : `${size} KG`;

    const pieceUnits = ['PIECE','PIECES','PC','PCS','Pcs','Pc'];
    if (pieceUnits.includes(unit)) {
      const count = parseInt(size as any, 10);
      if (!count || count === 0) return '0';
      return `${count} x <strong>${this.translate.instant('checkout.payment.checked')}</strong> 23KG`;
    }
    return baggageInfo.numberOfPeices? `${baggageInfo.numberOfPeices} X ${size} ${baggageInfo.unit || ''}`.trim() : `${size} ${baggageInfo.unit || ''}`.trim();
  }

  private getFlightRoute(index: number): string {    
    // First try: get from shared service selected flight itinerary
    const selectedItinerary = this.sharedService.selectedFlightItinerary;
    if (selectedItinerary?.allJourney?.flights && selectedItinerary.allJourney.flights[index]) {
      const flight = selectedItinerary.allJourney.flights[index];
      const departureCity = flight.flightDTO[0].departureTerminalAirport.cityCode;
      const arrivalCity = flight.flightDTO[flight.flightDTO.length - 1].arrivalTerminalAirport.cityCode;
      const route = `${departureCity}-${arrivalCity}`;

      return route;
    }

    // Second try: get from the details array (current journeys)
    if (this.details && this.details.length > index) {
      const journey = this.details[index];
      if (journey.allJourney.flights && journey.allJourney.flights.length > 0) {
        const firstFlight = journey.allJourney.flights[0];
        const lastFlight = journey.allJourney.flights[journey.allJourney.flights.length - 1];
        const departureCity = firstFlight.flightDTO[0].departureTerminalAirport.cityCode;
        const arrivalCity = lastFlight.flightDTO[lastFlight.flightDTO.length - 1].arrivalTerminalAirport.cityCode;
        const route = `${departureCity}-${arrivalCity}`;

        return route;
      }
    }

    console.warn('Could not determine flight route for index:', index);
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

  public hasPaxType(paxType: string): boolean {
    const arr = this.flightResultService?.baggageInfo;
    if (!arr || !Array.isArray(arr)) return false;
    return arr.some((b: any) => (b?.paxType || '').toUpperCase() === (paxType || '').toUpperCase());
  }
}
