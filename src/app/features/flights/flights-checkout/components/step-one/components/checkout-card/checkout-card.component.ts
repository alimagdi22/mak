import { AfterViewInit, Component, ElementRef, inject, Input, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { IAirItinerary, ISearchCriteria } from 'rp-travel-ui';
import { FlightSharedService } from '../../../../../../../core/services/flightShared.service';
import { SharedService } from '../../../../../../../shared/shared.service';
import { FlightDetailsComponent } from '../../../../../flights-results/components/flight-details/flight-details.component';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-checkout-card',
  templateUrl: './checkout-card.component.html',
  styleUrl: './checkout-card.component.scss',
})
export class CheckoutCardComponent implements OnInit , AfterViewInit {
  @Input() details: IAirItinerary[] = [];
  @ViewChildren('departDetails') departDetailsEls!: QueryList<ElementRef>;
  @ViewChildren('returnDetails') returnDetailsEls!: QueryList<ElementRef>;

  private translate = inject(TranslateService);
  private flightSharedService = inject(FlightSharedService);
  private route = inject(ActivatedRoute);
  private router: Router = inject(Router)
  sharedService = inject(SharedService);
  dialog = inject(MatDialog);
  currentLang = this.translate.currentLang;
  searchCriteria!: ISearchCriteria;
  el = inject(ElementRef);
  renderer= inject(Renderer2); 
  searchParams: any;
  selectedBrands: any = null;
  private readonly SESSION_STORAGE_SELECTED_TICKET = 'selectedTicket';
  ticketType: 'branded' | 'standard' | null = null;
  selectedBrand:any;
  hasStepTwo:boolean = false;

  ngOnInit() {
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
      this.loadSelectedTicket();
      this.hasStepTwo = this.router.url.includes('step-two');   
    });
  }

  ngAfterViewInit(): void {
    this.departDetailsEls.forEach((el: ElementRef) => {
      this.applyMarginIfWrapped(el.nativeElement);
    });

    this.returnDetailsEls.forEach((el: ElementRef) => {
      this.applyMarginIfWrapped(el.nativeElement);
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


  private applyMarginIfWrapped(element: HTMLElement): void {
    // If the content inside is wrapped, scrollHeight will be greater than clientHeight
    if (element.scrollHeight > element.clientHeight) {
      element.style.marginTop = '30px';
    } else {
      element.style.marginTop = '0';
    }
  }

  goToFlightDetails(airItinerary: IAirItinerary) {
    this.sharedService.showFlightDetails(airItinerary);
    this.sharedService.selectedFlightItinerary = airItinerary;

    this.dialog.open(FlightDetailsComponent, {
      data: {
        searchCriteria: this.searchCriteria,
        dismiss: () => this.dialog.closeAll(),
      },
      width: '70vw',
      height: '90vh',
      maxWidth: '100vw',
      hasBackdrop: true,
    });
  }
  getBaggageCountOnlyOrRaw(baggage: string): string {
    if (!baggage) return '';

    const [countStr, unit] = baggage.split(' ');

    const isPieceUnit = ['Piece', 'Pieces', 'PC', 'Pcs'].includes(unit);

    if (isPieceUnit) {
      const count = parseInt(countStr, 10);
      if (count === 0) {
        return '0 PCs';
      }
      return `${count} x 23KG`;
    }

    return baggage;
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

  getTotalTransitMinutes(...times: string[]): number {
    const convert = (time: string) => {
      const [hours, minutes, seconds] = time.split(':').map(Number);
      return hours * 60 + minutes + Math.floor((seconds || 0) / 60);
    };

    return times.reduce((sum, time) => sum + convert(time), 0);
  }
}
