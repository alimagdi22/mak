import { ChangeDetectorRef, Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../../../../../shared/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { FlightCheckoutApiService, FlightCheckoutService, IAirItinerary, mergedGates } from 'rp-travel-ui';

declare var PaymentSession: any;

interface IFareDetails {
  currencyCode?: string;
  amount?: number;
  brandId?: number;
}

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrl: './payment-method.component.scss',
})
export class PaymentMethodComponent implements OnInit, OnDestroy {
  private readonly SESSION_STORAGE_FLIGHT_PREFIX = 'flightData_';
  private readonly SESSION_STORAGE_SELECTED_TICKET = 'selectedTicket';

  public sharedService = inject(SharedService);
  private translateService = inject(TranslateService);
  private route = inject(ActivatedRoute);
  public flightCheckoutService = inject(FlightCheckoutService);
  private flightCheckoutApiService = inject(FlightCheckoutApiService);
  private cdRef = inject(ChangeDetectorRef);
  private router = inject(Router);

  selectedTicket?: string;
  selectedFlight: any = null;
  selectedBrands: any = null;
  currentLang = this.translateService.currentLang;
  paymentData$!: Observable<any>;
  selectedOption: number | null = null;
  selectedGatway!: mergedGates;
  checked = false;
  brandedFareId!: number;

  mpgsSessionId = '';
  showMPGSPayment = false;
  mpgsSessionInitialized = false;
  mpgsLoading = false;

  amount: number | undefined;
  currency: string | undefined;

  mpgsAlreadyInitialized = false; // ✅ Prevent duplicate initialization

  searchParams: any = {};
  brandedFare: IFareDetails = {};

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.searchParams = {
        searchId: params['sid']?.split('_')[0],
        sequenceNum: params['sequenceNum'],
        providerKey: params['providerKey'] || params['pkey'],
        pcc: params['sid']?.split('_')[1],
      };

      this.loadDataFromSessionStorage();
      this.loadPaymentData(
        this.selectedFlight.searchCriteria.currency,
        this.selectedFlight.searchCriteria.pos,
        this.selectedFlight.airItineraryDTO,
      );
    });
  }

  loadPaymentData(userCurrency: string, paymentLocation: string, body: IAirItinerary): void {
    this.paymentData$ = this.flightCheckoutApiService.addPaymentGateways(userCurrency, paymentLocation, body);
    this.paymentData$.subscribe((gateways: mergedGates[]) => {
      if (!this.selectedGatway) {
        const knetIndex = gateways.findIndex((g) => g.PaymentMethod?.toLowerCase() === 'hostedknet');
        if (knetIndex !== -1) {
          this.selectOption(knetIndex, gateways[knetIndex]);
        }
      }
    });
  }

  private getFlightDataKey(): string {
    return `${this.SESSION_STORAGE_FLIGHT_PREFIX}${this.searchParams.searchId}_${this.searchParams.sequenceNum}_${this.searchParams.providerKey}`;
  }

  private getBrandedFaresKey(): string {
    return `${this.searchParams.searchId}${this.searchParams.sequenceNum}${this.searchParams.providerKey}${this.searchParams.pcc}`;
  }

  private loadDataFromSessionStorage(): void {
    if (!this.searchParams) return;

    const ticket = sessionStorage.getItem(this.SESSION_STORAGE_SELECTED_TICKET);
    this.selectedTicket = ticket || undefined;

    const flightKey = this.getFlightDataKey();
    const flightData = sessionStorage.getItem(flightKey);
    if (flightData) {
      this.selectedFlight = JSON.parse(flightData);
      this.flightCheckoutService.selectedFlight = this.selectedFlight;
    }

    const brandsKey = this.getBrandedFaresKey();
    const brandsData = sessionStorage.getItem(brandsKey);
    if (brandsData) {
      this.selectedBrands = JSON.parse(brandsData);

      const businessBrand = this.selectedBrands?.find(
        (brand: any) =>
          brand.itinTotalFare.amount > this.selectedBrands[0].itinTotalFare.amount && brand.isRefundable === true,
      );

      if (businessBrand) {
        this.brandedFare = {
          currencyCode: businessBrand.itinTotalFare?.currencyCode,
          amount: businessBrand.itinTotalFare?.amount,
          brandId: businessBrand.brandId,
        };
      }
    }
  }

  loadHostedSessionScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[src*="session.js"]');
      if (existing) existing.remove();

      (window as any).PaymentSession = null;

      const script = document.createElement('script');
      script.src = 'https://nbkpayment.gateway.mastercard.com/form/version/59/merchant/900160001/session.js';
      // script.src = 'https://test-gateway.mastercard.com/form/version/59/merchant/TestCAEMER79/session.js';

      script.onload = () => resolve();
      script.onerror = () => reject(new Error('MPGS script failed to load'));

      document.body.appendChild(script);
    });
  }

  selectOption(index: number, gateway: any): void {
    this.selectedGatway = gateway;
    this.selectedOption = index;
    this.sharedService.selectedGateway = gateway;

    if (gateway.GatewayType === 'MPGS') {
      if (this.selectedTicket === 'branded') {
        this.amount = this.brandedFare.amount;
        this.currency = this.brandedFare.currencyCode;
      } else {
        this.amount = this.selectedFlight.airItineraryDTO.itinTotalFare.amount;
        this.currency = this.selectedFlight.airItineraryDTO.itinTotalFare.currencyCode;
      }

      this.showMPGSPayment = true;

      // ❗ DO NOT re-create session if already created previously
      if (this.mpgsAlreadyInitialized) {
        this.mpgsSessionInitialized = true;
        this.cdRef.detectChanges();
        return;
      }

      const gatewayAmount = this.sharedService.selectedGateway?.Amount ?? 0;

      this.loadHostedSessionScript()
        .then(() => {
          if (this.amount) {
            this.flightCheckoutApiService
              .createMPGSSession(gateway.GatewayType, this.amount + gatewayAmount, this.currency)
              .subscribe({
                next: (sessionId: string) => {
                  this.mpgsSessionId = sessionId;

                  this.mpgsAlreadyInitialized = true; // ✅ prevent future reinitialization
                  this.showMPGSPayment = true;

                  this.cdRef.detectChanges();

                  setTimeout(() => {
                    this.mpgsLoading = true;
                    this.mpgsSessionInitialized = false;
                    this.initializePaymentSession();
                  }, 0);
                },
                error: (err) => {
                  console.error('Failed to create MPGS session', err);
                  this.showMPGSPayment = false;
                },
              });
          }
        })
        .catch((error) => {
          console.error('Failed to load MPGS script:', error);
        });
    } else {
      this.showMPGSPayment = false;
    }
  }

  initializePaymentSession(): void {
    PaymentSession.configure({
      session: this.mpgsSessionId.replaceAll('"', ''),
      fields: {
        card: {
          number: '#card-number',
          securityCode: '#security-code',
          expiryMonth: '#expiry-month',
          expiryYear: '#expiry-year',
          nameOnCard: '#cardholder-name',
        },
      },
      frameEmbeddingMitigation: ['javascript'],
      callbacks: {
        initialized: () => {
          this.mpgsLoading = false;
          this.mpgsSessionInitialized = true;
        },
        formSessionUpdate: (response: any) => {
          if (response.status !== 'ok') {
            console.error('Form session update failed', response);
          }
        },
      },
    });
  }

  submit(selectedMethod: mergedGates) {
    this.sharedService.triggerSubmit();

    // Wait for trimming and validation to complete before checking form validity
    setTimeout(() => {
      if (this.sharedService.userForm.valid) {
        if (this.selectedGatway.GatewayType === 'MPGS') {
          PaymentSession.updateSessionFromForm('card');
        }

        this.flightCheckoutService.newPaymentSaveBooking(
          this.selectedFlight.searchCriteria.currency,
          'notPremium',
          this.selectedFlight.pcc,
          this.selectedTicket === 'branded' ? this.brandedFare.brandId! : this.brandedFareId,
          selectedMethod,
          this.mpgsSessionId.replaceAll('"', ''),
        );
      }
    }, 0);
  }

  submitPayment(event: Event): void {
    event.preventDefault();
    this.sharedService.triggerSubmit();
  }

  redirectToHome() {
    this.flightCheckoutService.paymentError = false;
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.sharedService.selectedGateway = null as any;

    // 🔥 FULL CLEANUP so returning to page reloads everything cleanly
    this.mpgsAlreadyInitialized = false;
    this.mpgsSessionInitialized = false;

    const existingIframe = document.querySelector('iframe[src*="mastercard"]');
    if (existingIframe) existingIframe.remove();

    const script = document.querySelector('script[src*="session.js"]');
    if (script) script.remove();

    (window as any).PaymentSession = null;
  }
}
