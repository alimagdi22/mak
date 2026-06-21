import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FlightResultService, FlightSearchService, IAirItinerary, ICardModel, RpTravelUiModule } from 'rp-travel-ui';
import { FlightSharedService } from '../../../core/services/flightShared.service';
import { FlightDetailsComponent } from '../../../features/flights/flights-results/components/flight-details/flight-details.component';
import { DurationFormatPipe } from '../../pipes/duration-format.pipe';
import { TimeFormatPipe } from '../../pipes/time-format.pipe';
import { SharedService } from '../../shared.service';
import { FlightResultCardComponent } from '../flight-result-card/flight-result-card.component';

@Component({
  selector: 'app-flight-results-page-card',
  templateUrl: './flight-results-page-card.component.html',
  styleUrl: './flight-results-page-card.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FlightResultCardComponent,
    TranslateModule,
    RpTravelUiModule,
    MatDialogModule,
    TimeFormatPipe,
    MatProgressSpinnerModule,
  ],
})
export class FlightResultsPageCardComponent implements OnDestroy {
  // @Input() showTag: boolean = false;
  @Input() showPriceBox: boolean = false;
  @Input() index = 0;
  @Input() trip!: ICardModel;
  @Input() details: IAirItinerary[] = [];

  sharedService = inject(SharedService);
  dialog = inject(MatDialog);
  moreFlights: boolean = false;
  isSelectButtonLoading = false;

  flightSharedService = inject(FlightSharedService);
  flightSearchService = inject(FlightSearchService);
  flightResultService = inject(FlightResultService);
  translate = inject(TranslateService);

  router = inject(Router);

  currentLang = this.translate.currentLang;
  isExpanded = false;
  trigger = false;
  moreFlightsMobile: boolean = false;

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/image/userPage/image.png';
  }

  get flightType() {
    let type;

    switch (this.trip.flightType.toLowerCase()) {
      case 'oneway':
        type = 'One Way';
        break;
      case 'return':
        type = 'Round Trip';
        break;
      case 'multitrip':
        type = 'Multi Trip';
        break;
    }

    return type;
  }

  showFlightDetails(airItinerary: IAirItinerary, e: Event) {
    e.stopPropagation();
    this.sharedService.showFlightDetails(airItinerary);
    this.sharedService.selectedFlightItinerary = airItinerary;

    this.dialog.open(FlightDetailsComponent, {
      data: {
        dismiss: () => this.dialog.closeAll(),
      },
      width: '70vw',
      height: '90vh',
      maxWidth: '100vw',
      hasBackdrop: true,
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

  goToCheckout(sequenceNum: number, providerKey: string | null, pcc: string) {
    this.isSelectButtonLoading = true;

    this.router.navigate(['/flights-checkout'], {
      queryParams: {
        sid: this.flightResultService.searchID + '_' + pcc,
        sequenceNum: sequenceNum,
        providerKey: providerKey,
      },
    });
  }

  toggleMoreFlights() {
    this.moreFlights = !this.moreFlights;
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

  getTotalTransitMinutes(...times: string[]): number {
    const convert = (time: string) => {
      const [hours, minutes, seconds] = time.split(':').map(Number);
      return hours * 60 + minutes + Math.floor((seconds || 0) / 60);
    };

    return times.reduce((sum, time) => sum + convert(time), 0);
  }

  ngOnDestroy(): void {
    this.isSelectButtonLoading = false;
  }
}
