import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AIR_ITINERARIES_DEFAULT, flightOfflineService, IAirItinerary, IBaggageInformation, IFlight, selectedFlight } from 'rp-travel-ui';
import { Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ISortItem } from './models/sortItem.model';
import { IPaymentGateway } from '../core/models/paymentMethod';
@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private router = inject(Router);
  private translate = inject(TranslateService);
  selectedItinerary = -1;
  selectedBrandedIndex = -1;
  selectedFlight!: selectedFlight;
  selectedSortItem: ISortItem = {
    title: 'Cheapest',
    price: '',
    currency: '',
    isActive: false,
    sortCode: 1,
  }
  
     public destinationType:string = '';

  selectedOfllineService!: flightOfflineService;
  country: string = 'EG';
  phoneNumber: string = '';
  email: string = '';
  countryCode: string = '20';
  private submitTriggerSource = new Subject<void>();
  submitTrigger$ = this.submitTriggerSource.asObservable();
  selectedTicket!: 'branded' | 'standard';

  contactForm: any;
  userForm: any;

  screenWidth = 0;
  webViewBreakPoint = 1180;

  loader: boolean = true;
  missingFields: string[] = [];

  isGlobalModalOpened = false;
  isMenuModalOpened = false;
  isSessionTimeoutModalShowed = false;
  isFlightDetailsShowed = false;
  userManagementNotifier = new Subject<number>();

  searchParams! : Params;
  selectedCardData!:any;

  selectedFlightItinerary: IAirItinerary = AIR_ITINERARIES_DEFAULT;

  baggageInfo: IBaggageInformation[] = [];
  baggageInfoFlight!: IFlight;
  isBaggageInfoShowed = false;

  isAuthenticated = false;
  isPaymentModalShowed = false;
  isFirstRequest = true;

  selectedGateway:IPaymentGateway | null = null;

  selectedBaggageIndex:number = 0
  showFlightDetails(airItinerary: IAirItinerary | null): void {
    if (airItinerary) {
      this.selectedFlightItinerary = airItinerary;
    }

    this.isFlightDetailsShowed = true;
  }

  closeModals() {
    this.isGlobalModalOpened = false;
    this.isMenuModalOpened = false;
    this.isBaggageInfoShowed = false;
    this.isPaymentModalShowed = false;
  }

  triggerSubmit() {
    this.submitTriggerSource.next();
  }

  convertTimeToDayAndHour(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
if (this.translate.currentLang === 'ar') {
  return `${hours}ساعة ${minutes}دقيقة`;
}else{
    return `${hours}h ${minutes}m`;

}
  }

  getPassengerTypeName(passengerType: string) {
    switch (passengerType) {
      case 'CHD':
        return 'Child';
      case 'CNN':
        return 'Child';
      case 'INF':
        return 'Infant';
    }

    return 'Adult';
  }

  isSegmentPresent(segments: string[]): boolean {
    for (let i = 0; i < segments.length; i++) {
      if (this.router.url.includes(segments[i])) {
        return true;
      }
    }
    return false;
  }

  get lang(): 'en' | 'ar' {
    return this.translate.currentLang as 'en' | 'ar';
  }
}
