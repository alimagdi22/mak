import { Component, inject, Input } from '@angular/core';
import { FlightCheckoutService, FlightResultService, IBaggageInformation, ISearchCriteria } from 'rp-travel-ui';
import { SharedService } from '../../../../../../../shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-baggage-details',
  templateUrl: './baggage-details.component.html',
  styleUrl: './baggage-details.component.scss',
})
export class BaggageDetailsComponent {
  sharedService = inject(SharedService);
  public flightResultService = inject(FlightResultService);
  public flightCheckoutService = inject(FlightCheckoutService);
  baggageInfo: IBaggageInformation = this.sharedService.selectedFlightItinerary.baggageInformation[0];
  @Input() searchCriteria?: ISearchCriteria;
  private route = inject(ActivatedRoute);
  private router: Router = inject(Router)
  searchParams: any;
  selectedBrands: any = null;
  private readonly SESSION_STORAGE_SELECTED_TICKET = 'selectedTicket';
  ticketType: 'branded' | 'standard' | null = null;
  selectedBrand:any;
  hasStepTwo:boolean = false;

  ngOnInit(){
    this.route.queryParams.subscribe((params) => {
      this.searchParams = {
        searchId: params['sid']?.split('_')[0],
        sequenceNum: params['sequenceNum'],
        providerKey : params['providerKey'] || params['pkey'],
        pcc: params['sid']?.split('_')[1],
      };
      this.loadBrandedFaresData();
      this.prepareFareDetails();
      this.hasStepTwo = this.router.url.includes('step-two');      
    });
    this.loadSelectedTicket()
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
    console.log('Baggage Info:', this.flightResultService?.baggageInfo);

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

  getBaggageCountOnlyOrRaw(baggage: string | null | undefined): string {
    if (!baggage) return '';
    const parts = baggage.split(' ');
    const countStr = parts[0];
    const unit = parts[1];
    const isPieceUnit = ['Piece', 'Pieces', 'PC', 'Pcs'].includes(unit);
    if (isPieceUnit) {
      const count = parseInt(countStr, 10);
      if (count === 0) return '0 PCs';
      return `${count} x 23KG`;
    }
    return baggage;
  }

  /** Get passenger type specific baggage allowance for LEGACY (non-branded) **/
  getPassengerBaggageAllowance(passengerType: string): any {
    const baggageInfo = this.flightResultService?.baggageInfo;
    if (!baggageInfo || baggageInfo.length === 0) return null;

    // For legacy structure: find the baggage that matches the passenger type
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

    // For branded structure: find all baggage allowances for this passenger type
    return baggageAllowances.filter((baggage: any) => 
      baggage.paxType === this.getPaxTypeCode(passengerType)
    );
  }

  hasInfantBaggage(): boolean {
    if (!this.selectedBrand?.baggageAllowances || !Array.isArray(this.selectedBrand.baggageAllowances)) {
      return false;
    }

    return this.selectedBrand.baggageAllowances.some(
      (baggage: any) => baggage.paxType === 'INF'
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

    if (!passengerBaggageList || passengerBaggageList.length === 0) {
      console.warn('No branded baggage found for passenger:', passengerType);
      return '';
    }

    // Get the flight route for the current index
    const flightRoute = this.getFlightRoute(index);

    if (!flightRoute) {
      console.warn('No flight route found for index:', index);
      return '';
    }

    // Find the baggage detail for the specific flight route
    for (const passengerBaggage of passengerBaggageList) {
      
      if (!passengerBaggage.baggageAllowanceDetails) continue;
      
      const detail = passengerBaggage.baggageAllowanceDetails.find((detail: any) => {
        return detail.flightRoute === flightRoute;
      });
      
      if (detail) {
        const result = this.formatBaggageInfo(detail.baggageAllowanceInfo);
        return result;
      }
    }

    // If no specific route found, return the first available baggage
    const firstBaggage = passengerBaggageList[0];
    if (firstBaggage?.baggageAllowanceDetails?.[0]) {
      const result = this.formatBaggageInfo(firstBaggage.baggageAllowanceDetails[0].baggageAllowanceInfo);
      return result;
    }

    console.warn('No branded baggage detail found for passenger:', passengerType, 'index:', index);
    return '';
  }

  /** Get flight route city names for display **/
  getFlightRouteCityNames(index: number): string {
    console.log('Baggage Info:', this.flightResultService?.baggageInfo);

    const flights = this.sharedService.selectedFlightItinerary?.allJourney?.flights || 
                  this.flightCheckoutService.selectedFlight?.airItineraryDTO?.allJourney?.flights;
    
    if (!flights || !flights[index]) return '';
    
    const item = flights[index];
    if (!item.flightDTO || item.flightDTO.length === 0) return '';
    
    const departureCity = item.flightDTO[0].departureTerminalAirport.cityName;
    const arrivalCity = item.flightDTO[item.flightDTO.length - 1].arrivalTerminalAirport.cityName;
    
    return `${departureCity} - ${arrivalCity}`;
  }

  /** LEGACY fares baggage count **/
  getBaggageCount(index: number, passengerType: string): string {    
    const passengerBaggage = this.getPassengerBaggageAllowance(passengerType);
    
    if (!passengerBaggage || !passengerBaggage.baggageAllowanceDetails) {
      console.warn('No baggage details found for passenger:', passengerType);
      return '';
    }

    // Get the flight route for the current index
    const flightRoute = this.getFlightRoute(index);

    if (!flightRoute) {
      console.warn('No flight route found for index:', index);
      return '';
    }
    
    // Find the baggage detail for the specific flight route
    const detail = passengerBaggage.baggageAllowanceDetails.find((detail: any) => {
      return detail.flightRoute === flightRoute;
    });
    
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
      if (!count || count === 0) return '0 PCs';
      return `${count} x 23KG`;
    }
    return baggageInfo.numberOfPeices? `${baggageInfo.numberOfPeices} X ${size} ${baggageInfo.unit || ''}`.trim():`${size} ${baggageInfo.unit || ''}`.trim();
  }

  /** Get flight route for the given index **/
  private getFlightRoute(index: number): string {    
    // Get flights from shared service or flight checkout service
    const flights = this.sharedService.selectedFlightItinerary?.allJourney?.flights || 
                  this.flightCheckoutService.selectedFlight?.airItineraryDTO?.allJourney?.flights;

    if (!flights || !flights[index]) {
      console.warn('No flight found for index:', index);
      return '';
    }
    
    const item = flights[index];
    
    if (!item.flightDTO || item.flightDTO.length === 0) {
      console.warn('No flightDTO found for flight item');
      return '';
    }
    
    const departureCity = item.flightDTO[0].departureTerminalAirport.cityCode;
    const arrivalCity = item.flightDTO[item.flightDTO.length - 1].arrivalTerminalAirport.cityCode;
    const route = `${departureCity}-${arrivalCity}`;
        
    return route;
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

    // Get the flight route for the current index
    const flightRoute = this.getFlightRoute(index);

    // Find the baggage detail for the specific flight route
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