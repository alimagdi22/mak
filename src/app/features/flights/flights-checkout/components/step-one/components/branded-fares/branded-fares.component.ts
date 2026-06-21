import { Component, inject, Input, OnInit, SimpleChanges, ViewChild, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { FlightCheckoutService, flightOfflineService, FlightResultService, selectedFlight } from 'rp-travel-ui';
import { SharedService } from '../../../../../../../shared/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { BrandedFareInfoModalComponent } from '../branded-fare-info-modal/branded-fare-info-modal.component';
import { Subscription } from 'rxjs';

interface IFareDetails {
  currencyCode?: string;
  amount?: number;
  brandId?: number;
}

@Component({
  selector: 'app-branded-fares',
  templateUrl: './branded-fares.component.html',
  styleUrl: './branded-fares.component.scss',
})
export class BrandedFaresComponent implements OnInit, OnDestroy {
  private readonly SESSION_STORAGE_FLIGHT_PREFIX = 'flightData_';
  private readonly SESSION_STORAGE_BRANDS_PREFIX = 'brandedFares_';
  private readonly SESSION_STORAGE_SELECTED_TICKET = 'selectedTicket';
  @ViewChild('infoModal') infoModal!: BrandedFareInfoModalComponent;

  // Services
  sharedService = inject(SharedService);
  translateService = inject(TranslateService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public flightCheckoutService = inject(FlightCheckoutService);
  public flightResultService = inject(FlightResultService);

  // Subscription management
  private brandedFareSubscription?: Subscription;

  // Component state
  ticketType: 'branded' | 'standard' | null = null;
  currentLang = this.translateService.currentLang;
  isNavigating = false;
  isLoading = false;
  @Input() offlineServices!: flightOfflineService[];
  buttonService?: flightOfflineService;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['offlineServices'] && this.offlineServices?.length) {
      this.buttonService = this.offlineServices.find((s) => s.serviceType === 'button');
    }
  }

  // Data
  selectedFlight: selectedFlight | null = null;
  selectedBrands: any = null;
  standardFare: IFareDetails = {};
  brandedFare: IFareDetails = {};

  // Query params
  searchParams: any;
  brandId?: number = 0;

  selectedBrand: any;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.searchParams = {
        searchId: params['sid']?.split('_')[0],
        sequenceNum: params['sequenceNum'],
        providerKey: params['providerKey'] || params['pkey'],
        pcc: params['sid']?.split('_')[1],
      };
      this.loadFlightData();
      this.subscribeToBrandedFaresNotifier();
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription
    if (this.brandedFareSubscription) {
      this.brandedFareSubscription.unsubscribe();
    }
  }

  /**
   * Subscribe to the branded fares notifier from FlightResultService
   * This gets triggered when branded fares are successfully loaded
   */
  private subscribeToBrandedFaresNotifier(): void {
    this.brandedFareSubscription = this.flightResultService.brandedFareNotifier.subscribe({
      next: () => {
        console.log('Branded fares notifier triggered - loading data');
        // Reload the branded fares data from session storage
        this.loadBrandedFaresData();

        // Re-prepare fare details now that we have the data
        if (this.selectedBrands) {
          this.prepareFareDetails();
        }
      },
      error: (err) => {
        console.error('Error loading branded fares:', err);
      },
    });
  }

  private async loadFlightData(): Promise<void> {
    this.isLoading = true;

    try {
      const cachedFlight = this.getCachedFlightData();
      this.selectedFlight = cachedFlight ?? (await this.getFlightFromOtherSources());

      if (!this.flightCheckoutService.loader) {
        if (!this.selectedFlight) {
          throw new Error('No flight data available');
        }
      }

      this.loadBrandedFaresData();
      this.loadSelectedTicket();
      this.prepareFareDetails();
    } catch (error) {
      console.error('Error loading flight data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private getCachedFlightData(): selectedFlight | null {
    if (!this.searchParams) return null;
    const key = this.getFlightDataKey();
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  private async getFlightFromOtherSources(): Promise<selectedFlight | null> {
    if (this.flightCheckoutService.selectedFlight) return this.flightCheckoutService.selectedFlight;

    if (this.sharedService.selectedFlight) return this.sharedService.selectedFlight;

    const { searchId, sequenceNum, providerKey, pcc } = this.searchParams;

    await this.flightCheckoutService.getSelectedFlightData(searchId, sequenceNum, providerKey, false, pcc);

    return this.flightCheckoutService.selectedFlight ?? null;
  }

  private loadBrandedFaresData(): void {
    const key = this.getBrandedFaresKey();
    const data = sessionStorage.getItem(key);
    if (data) {
      this.selectedBrands = JSON.parse(data);
      console.log('Loaded branded fares from session storage:', this.selectedBrands);
    } else {
      // Check if data is in the service's currentSelectedBrands
      if (this.flightResultService.currentSelectedBrands?.length > 0) {
        this.selectedBrands = this.flightResultService.currentSelectedBrands;
        console.log('Loaded branded fares from service:', this.selectedBrands);
      }
    }
  }

  private getFlightDataKey(): string {
    const { searchId, sequenceNum, providerKey } = this.searchParams;
    return `${this.SESSION_STORAGE_FLIGHT_PREFIX}${searchId}_${sequenceNum}_${providerKey}`;
  }

  private getBrandedFaresKey(): string {
    const { searchId, sequenceNum, providerKey, pcc } = this.searchParams;
    return `${searchId}${sequenceNum}${providerKey}${pcc}`;
  }

  private loadSelectedTicket(): void {
    const ticket = sessionStorage.getItem(this.SESSION_STORAGE_SELECTED_TICKET);
    if (ticket === 'branded' || ticket === 'standard') {
      this.ticketType = ticket;
    }
  }

  private saveSelectedTicket(): void {
    if (this.ticketType) {
      sessionStorage.setItem(this.SESSION_STORAGE_SELECTED_TICKET, this.ticketType);
    } else {
      sessionStorage.removeItem(this.SESSION_STORAGE_SELECTED_TICKET);
    }
  }

  private prepareFareDetails(): void {
    this.standardFare = {
      currencyCode: this.selectedFlight?.airItineraryDTO?.itinTotalFare?.currencyCode,
      amount: this.selectedFlight?.airItineraryDTO?.itinTotalFare?.amount,
    };
    console.log('Preparing fare details with brands:', this.selectedBrands);

    if (this.selectedBrands && Array.isArray(this.selectedBrands) && this.selectedBrands.length > 0) {
      const businessBrand = this.selectedBrands.find(
        (brand: any) =>
          brand.itinTotalFare.amount > this.selectedBrands[0].itinTotalFare.amount && brand.isRefundable === true,
      );
      this.selectedBrand = businessBrand;
      console.log(businessBrand, 'business brand found');

      if (businessBrand) {
        this.brandedFare = {
          currencyCode: businessBrand.itinTotalFare?.currencyCode,
          amount: businessBrand.itinTotalFare?.amount,
          brandId: businessBrand.brandId,
        };

        // Only set default ticket type if not already set
        if (!this.ticketType) {
          this.ticketType = 'branded';
          this.saveSelectedTicket();
        }
      }
    }

    // If branded doesn't exist and no ticket selected yet, default to standard
    if (!this.ticketType) {
      this.ticketType = 'standard';
      this.saveSelectedTicket();
    }
  }

  selectTicket(type: 'branded' | 'standard'): void {
    this.ticketType = type;
    this.saveSelectedTicket();
  }

  async bookTicket(): Promise<void> {
    if (!this.ticketType) return;

    this.sharedService.selectedTicket = this.ticketType;
    this.saveSelectedTicket();

    const queryParams = {
      ...this.route.snapshot.queryParams,
      ...(this.ticketType === 'branded' && this.brandedFare.brandId ? { brandId: this.brandedFare.brandId } : {}),
    };

    try {
      await this.router.navigate(['flights-checkout/step-two'], { queryParams, queryParamsHandling: 'merge' });
    } catch (err) {
      console.error('Navigation error:', err);
    }
  }

  scrollToContactFormById(): void {
    const el = document.getElementById('contact-details');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  async handleDesktopSelection(type: 'branded' | 'standard', event: MouseEvent): Promise<void> {
    if (this.isNavigating) return;

    this.isNavigating = true;
    event.preventDefault();
    event.stopPropagation();

    try {
      const form = this.sharedService.contactForm;
      if (form) {
        form.markAllAsTouched();
        form.updateValueAndValidity();
        this.sharedService.triggerSubmit();
        
        if (!form.valid) {
          this.scrollToContactFormById();
          return;
        }
      }

      this.selectTicket(type);
      await this.bookTicket();
    } finally {
      this.isNavigating = false;
    }
  }

  openInfoModal() {
    this.infoModal.open();
  }
}
