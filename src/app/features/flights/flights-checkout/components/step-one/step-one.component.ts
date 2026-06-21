import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  FlightCheckoutService,
  flightOfflineService,
  FlightResultService,
  HomePageService,
  IAirItinerary,
  selectedFlight
} from 'rp-travel-ui';
import { Subscription, take } from 'rxjs';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_POS_COUNTRY,
  SESSION_STORAGE_PREFIX,
  SESSION_TIMEOUT,
} from '../../../../../core/constants/default/flight-checkout.default';
import { IGetSelectedFlight } from '../../../../../core/models/model';
import { SharedService } from '../../../../../shared/shared.service';
import { FlightSharedService } from '../../../../../core/services/flightShared.service';
import { FlightDetailsComponent } from '../../../flights-results/components/flight-details/flight-details.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss'],
})
export class StepOneComponent implements OnInit {
  // Services
  private readonly route = inject(ActivatedRoute);
  public readonly sharedService = inject(SharedService);
  private readonly homePageService = inject(HomePageService);
  public readonly flightCheckoutService = inject(FlightCheckoutService);
  public flightResultService = inject(FlightResultService);
  private translate = inject(TranslateService);
  activatedRoute = inject(ActivatedRoute);

  // Subscriptions
  private subscription: Subscription = new Subscription();

  // Loading states
  readonly isOfflineServicesLoading = this.flightCheckoutService.offlineServicesLoader;
  readonly isSelectedFlightLoading = this.flightCheckoutService.loader;
  readonly isBrandedFaresLoading = this.flightResultService.isBrandedFaresLoading;

  // Combined loading state
  isLoading = this.isSelectedFlightLoading || this.isBrandedFaresLoading;

  // Flight data
  getSelectedFlightParams!: IGetSelectedFlight;
  flightDataLoaded = false;
  offlineServicesLoaded = false;
  offlineServices!: flightOfflineService[];
  selectedOfflineServiceCode!: string[];
  selectedFlightServicesAmount!: number;
  selectedOfllineService?: flightOfflineService;
  selectedTicket?: 'branded' | 'standard';
  contactDetails?: { email: string; phone: string; country: string };
  sessionTimer: number = SESSION_TIMEOUT;
  currentLang = this.translate.currentLang;
  airItineraries?: IAirItinerary;
  flightData!: any;
  flightSharedService = inject(FlightSharedService);
  dialog = inject(MatDialog);
  searchCriteria : any;
  ngOnInit(): void {
    this.initializeComponent();
    
    if(this.sharedService.selectedBrandedIndex !== -1) {
      this.sharedService.selectedBrandedIndex = 0;
    }
  }

  private initializeComponent(): void {
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      this.parseQueryParams(params);
      this.fetchFlightDataAndBrandedFares(); // Always fetch fresh data first
      this.setupResponseListeners();
      this.getOfflineServices();
      this.getCountries();
      this.getCachedFlightData()
    });
  }

  private parseQueryParams(params: any): void {
    const sidParts = params['sid']?.split('_');
    this.getSelectedFlightParams = {
      searchId: sidParts[0],
      pcc: sidParts[1],
      sequenceNum: +params['sequenceNum'],
      providerKey :params['providerKey'] || params['pkey']
    };
    
  }

  private fetchFlightDataAndBrandedFares(): void {
    const { searchId, sequenceNum, providerKey, pcc } = this.getSelectedFlightParams;
    
    // Always fetch fresh flight data
    this.flightCheckoutService.getSelectedFlightData(searchId, sequenceNum, providerKey, false, pcc);
    
    // Always fetch fresh branded fares
    this.flightResultService.getBrandedFares(searchId, sequenceNum, providerKey, pcc);
  }

  private setupResponseListeners(): void {
    this.setupFlightDataListener();
    this.setupOfflineServicesListener();
  }

  private setupFlightDataListener(): void {
    this.subscription.add(
      this.flightCheckoutService.notify.subscribe((status) => {
        if (status === 1 && this.flightCheckoutService.selectedFlight) {
          this.handleFlightDataResponse(this.flightCheckoutService.selectedFlight);
          this.sharedService.selectedFlight = this.flightCheckoutService.selectedFlight;
          
          // 🔹 Check query params for wego_click_id
          this.subscription.add(
            this.activatedRoute.queryParams.subscribe((params) => {
              if (params['wego_click_id']) {
                this.translate.use((this.flightCheckoutService.selectedFlight?.searchCriteria.language || '')); // switch language to Arabic
                const lang = this.flightCheckoutService.selectedFlight?.searchCriteria.language || '';
                this.homePageService.getCountries(lang);
                // Fetch the opposite language for cross-language search
                const oppositeLang = lang === 'ar' ? 'en' : 'ar';
                this.homePageService.getEnCountries(oppositeLang);
              } 
              // else {
              //   this.homePageService.getCountries((this.flightCheckoutService.selectedFlight?.searchCriteria.language || ''));
              // }
            })
          );
        }
      }),
    );
  }

  private setupOfflineServicesListener(): void {
    this.subscription.add(
      this.flightCheckoutService.offlineServicesResponse.subscribe((services) => {
        if (services) {
          this.handleOfflineServicesResponse(services);
        }
      }),
    );
  }

  private handleFlightDataResponse(flightData: selectedFlight): void {
    this.flightData = flightData;

    // Cache the fresh data
    this.cacheFlightData(flightData);

    if (flightData.airItineraryDTO) {
      this.airItineraries = flightData.airItineraryDTO;
      this.cacheAirItineraries(flightData.airItineraryDTO);
    }

    if (this.isInvalidFlight(flightData)) {
      this.handleInvalidFlight();
      return;
    }

    this.flightDataLoaded = true;
  }

  private isInvalidFlight(flightData: selectedFlight): boolean {
    return flightData.status === 'Invalid' || !flightData.airItineraryDTO?.allJourney;
  }

  private handleInvalidFlight(): void {
    this.isLoading = true;
    this.sessionTimer = 0;
    this.flightDataLoaded = false;
  }

  private handleOfflineServicesResponse(services: any): void {
    this.offlineServices = this.flightCheckoutService.organizeOfflineServices(services);
    this.selectedOfflineServiceCode = this.flightCheckoutService.selectedOfflineServices;
    this.offlineServicesLoaded = true;
    this.sharedService.selectedOfllineService = this.offlineServices.find(
      (service) => service.serviceCode === this.selectedOfflineServiceCode[0],
    )!;
  }

  private cacheAirItineraries(airItineraries: IAirItinerary): void {
    const storageKey = this.getAirItinerariesStorageKey();
    sessionStorage.setItem(storageKey, JSON.stringify(airItineraries));
  }

  public getCachedAirItineraries(): IAirItinerary | null {
    const storageKey = this.getAirItinerariesStorageKey();
    const cachedData = sessionStorage.getItem(storageKey);
    
    return cachedData ? JSON.parse(cachedData) : null;
  }

  public getCachedFlightData():any{
    const flightData = sessionStorage.getItem(this.getFlightDataStorageKey());
    if(flightData){
      const flight = JSON.parse(flightData);
      this.searchCriteria = flight.searchCriteria;    
    }
  }

  private getAirItinerariesStorageKey(): string {
    const { searchId, sequenceNum, providerKey } = this.getSelectedFlightParams;
    return `${SESSION_STORAGE_PREFIX}AIR_ITINERARIES_${searchId}_${sequenceNum}_${providerKey}`;
  }

  private cacheFlightData(flightData: selectedFlight): void {
    const storageKey = this.getFlightDataStorageKey();
    sessionStorage.setItem(storageKey, JSON.stringify(flightData));
  }

  private getFlightDataStorageKey(): string {
    const { searchId, sequenceNum, providerKey } = this.getSelectedFlightParams;
    return `${SESSION_STORAGE_PREFIX}${searchId}_${sequenceNum}_${providerKey}`;
  }

  private getOfflineServices(): void {
    const { searchId } = this.getSelectedFlightParams;
    const pos = this.homePageService.pointOfSale?.country || DEFAULT_POS_COUNTRY;
    const multiTypes = true;
    this.flightCheckoutService.getAllOfflineServices(searchId, pos, multiTypes);
  }

  private getCountries(): void {
    const currentLang = this.translate.currentLang;
    // Fetch countries in current language
    this.homePageService.getCountries(currentLang);
    // Fetch countries in opposite language for cross-language search
    const oppositeLang = currentLang === 'ar' ? 'en' : 'ar';
    this.homePageService.getEnCountries(oppositeLang);
  }

  onContactFormSubmit(data: { email: string; phone: string; country: string } | null): void {
    if (data) {
      this.contactDetails = data;
    }
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.flightCheckoutService.destroyer();
  }
}