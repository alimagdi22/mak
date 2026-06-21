import { Component, inject, Input, OnInit } from '@angular/core';
import { FlightResultService, IBaggageInformation, IFlight, ISearchCriteria } from 'rp-travel-ui';
import { DurationFormatPipe } from '../../../pipes/duration-format.pipe';
import { TimeFormatTransitPipe } from '../../../pipes/time-format-transit.pipe';
import { SharedService } from '../../../shared.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flight-result-card-duration',
  standalone: true,
  imports: [DurationFormatPipe, TimeFormatTransitPipe],
  templateUrl: './flight-result-card-duration.component.html',
  styleUrl: './flight-result-card-duration.component.scss',
})
export class FlightResultCardDurationComponent implements OnInit {
  @Input({ required: true }) flight!: IFlight;
  @Input({ required: true }) showBaggageIcon!: boolean;
  @Input({ required: true }) baggageInformation!: IBaggageInformation[];
  @Input() index:number = 0;
  @Input() details!:any;
  private flightResultService = inject(FlightResultService);
  private searchCriteria: ISearchCriteria | undefined = undefined;
  private sharedService = inject(SharedService);
  translate = inject(TranslateService);
  private route = inject(ActivatedRoute);
  private router: Router = inject(Router)
  searchParams: any;
  selectedBrands: any = null;
  private readonly SESSION_STORAGE_SELECTED_TICKET = 'selectedTicket';
  ticketType: 'branded' | 'standard' | null = null;
  selectedBrand:any;
  hasStepTwo:boolean = false;
  ngOnInit(): void {
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
        providerKey : params['providerKey'] || params['pkey'],
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
      this.loadSelectedTicket()
      this.hasStepTwo = this.router.url.includes('step-two');      
    });
    this.searchCriteria = this.flightResultService.response?.searchCriteria;
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

  /** NEW branded-only helper **/
  getBrandedBaggageCount(index: number): string {
    const allowance = this.selectedBrand?.baggageAllowances?.[index];
    const detail = allowance?.baggageAllowanceDetails?.[0];
    if (!detail) return '';
    const info = detail.baggageAllowanceInfo || {};
    const unit = (info.unit || '').toUpperCase();
    const size = info.size;

    if (unit.startsWith('KG')) return `${size} KG`;

    const pieceUnits = ['PIECE','PIECES','PC','PCS','Pcs','Pc'];
    if (pieceUnits.includes(unit)) {
      const count = parseInt(size as any, 10);
      if (!count || count === 0) return '0 PCs';
      return `${count} x 23KG`;
    }
    return `${size} ${info.unit || ''}`.trim();
  }

  /** Icon check for branded vs legacy **/
  isNoBaggageLegacy(baggage: string | null | undefined): boolean {
    return ['0 Piece', '0 KG', '0'].includes(baggage || '');
  }

  isNoBaggageBranded(index: number): boolean {
    const allowance = this.selectedBrand?.baggageAllowances?.[index];
    const detail = allowance?.baggageAllowanceDetails?.[0];
    const size = detail?.baggageAllowanceInfo?.size;
    const num = parseInt(size as any, 10);
    return !isNaN(num) && num === 0;
  }


showBaggageModal(baggageInfo: IBaggageInformation[]) {
  this.sharedService.isBaggageInfoShowed = true;
  this.sharedService.selectedBaggageIndex = this.index  ;
  this.sharedService.selectedCardData = this.details;
  this.sharedService.baggageInfo = baggageInfo.map(bag => ({
    ...bag,
    baggageFormatted: this.getBaggageCountOnlyOrRaw(bag.baggage)
  }));
  this.sharedService.baggageInfoFlight = this.flight;
}

    getBaggageCountOnlyOrRaw(baggage: string): string {
    if (!baggage) return '';

    const [countStr, unit] = baggage.split(' ');

    const isPieceUnit = ['Piece', 'Pieces', 'PC', 'Pcs'].includes(unit);
    const isKgUnit = ['KG', 'Kg', 'kg'].includes(unit);
  if (isPieceUnit) {
     if(countStr==="0"){
  return "0";
        }
    return `${countStr} x 23`;

  }
  if (isKgUnit) {
    return `${countStr}`;
  }
   
    return baggage;
  }

  hasTransit(flight: any): boolean {
  return (
    flight.stopsNum > 0 &&
    flight.flightDTO?.some((seg: any) => seg.transitTime !== '00:00:00')
  );
}

}
