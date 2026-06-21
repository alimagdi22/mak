import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EnvironmentService, FlightSearchService, HomePageService } from 'rp-travel-ui';
import ar from '../../public/i18n/ar.json';
import en from '../../public/i18n/en.json';
import { FooterComponent } from './core/components/footer/footer.component';
import { HeaderComponent } from './core/components/header/header.component';
import { ModalsComponent } from './shared/components/modals/modals.component';
import { SharedModule } from './shared/shared.module';
import { SharedService } from './shared/shared.service';
import { filter } from 'rxjs';
import { MostSearchedFlightsService } from './features/home/components/most-searched-flights/most-searched-flights.service';
import { DatepickerRtlDirective } from './shared/directives/datepickerrtl.directive';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SharedModule, HeaderComponent, ModalsComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Mak Travel';

  public translate = inject(TranslateService);
  public sharedService = inject(SharedService);
  public environmentService = inject(EnvironmentService);
  private router = inject(Router);
  private homePageService = inject(HomePageService);
  private flightSearchService = inject(FlightSearchService);
  private mostSearchedFlightsService = inject(MostSearchedFlightsService);

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      window.scrollTo(0, 0);
    });
    let envEjaza = {
      offlineSeats: 'http://154.41.209.93:7025',
      searchflow: 'https://stagingflightsearch.round-pixel.net',
      BookingFlow: 'https://stagingflightflow.round-pixel.net',
      FareRules: 'https://stagingflightprov.round-pixel.net',
      asm: 'https://stagingbackofficeapi.round-pixel.net',
      Apihotels: 'https://staginghotels.round-pixel.net',
      users: 'https://stagingflightsearch.round-pixel.net',
      admin: 'https://stagingadminapi.round-pixel.net/',
      getDPayment: 'https://stagingadminapi.round-pixel.net/',
      bookHotels: 'https://staginghotels.round-pixel.net',
      prepay: 'https://stagingprepayapi.round-pixel.net',
      backOffice: 'https://stagingbackofficeapi.round-pixel.net',
      FlightTop: 'https://stagingflightsearch.round-pixel.net',
      staticPages: 'https://stagingcms.round-pixel.net',
      offers: {
        getAll: 'http://154.41.209.93:7893/api/GetAllOffersAPI?POS=',
        getByID: 'http://154.41.209.93:7893/api/GetOfferByIdAPI?OfferId=',
        BookOffer: 'http://154.41.209.93:7895/api/BookOffer',
        RetriveItineraryDetails: '/api/Admin/RetriveItineraryDetails',
      },
    };

    let envRP = {
      offlineSeats: 'http://41.223.55.14:7025',
      searchflow: 'https://flightsearch.round-pixel.net',
      BookingFlow: 'https://flightflow.round-pixel.net',
      FareRules: 'https://flightprov.round-pixel.net',
      asm: 'https://backofficeapi.round-pixel.net',
      Apihotels: 'https://hotelsapi.round-pixel.net',
      users: 'https://usersapi.round-pixel.net',
      admin: 'https://adminapi.round-pixel.net/',
      getDPayment: 'https://adminapi.round-pixel.net/',
      bookHotels: 'https://hotels.round-pixel.net',
      prepay: 'https://prepayapi.round-pixel.net',
      backOffice: 'https://backofficeapi.round-pixel.net',
      FlightTop: 'https://flightsearch.round-pixel.net',
      offers: {
        getAll: 'http://41.215.243.36:7893/api/GetAllOffersAPI?POS=',
        getByID: 'http://41.215.243.36:7893/api/GetOfferByIdAPI?OfferId=',
        BookOffer: 'http://41.215.243.36:7895/api/BookOffer',
        RetriveItineraryDetails: '/api/Admin/RetriveItineraryDetails',
      },
    };
    let envWegoDemo = {
      offlineSeats: 'http://154.41.209.93:7025',
      searchflow: 'https://demoflightsearch.round-pixel.net',
      BookingFlow: 'https://demoflightflow.round-pixel.net',
      FareRules: 'https://demoflightprov.round-pixel.net',
      asm: 'https://demobackofficeapi.round-pixel.net',
      Apihotels: 'https://hotels.round-pixel.net',
      hotelprepay: 'https://demoprepayapi.round-pixel.net',
      users: 'https://demousersapi.round-pixel.net',
      admin: 'https://demoadminapi.round-pixel.net/',
      getDPayment: 'https://demoadminapi.round-pixel.net/',
      bookHotels: 'https://hotels.round-pixel.net',
      prepay: 'https://demoprepayapi.round-pixel.net',
      backOffice: 'https://demobackofficeapi.round-pixel.net',
      FlightTop: 'https://demoflightsearch.round-pixel.net',
      offers: {
        getAll: 'http://154.41.209.93:7893/api/GetAllOffersAPI?POS=',
        getAllActive: 'http://154.41.209.93:7893/api/GetAllActiveOffersAPI?POS=',
        getByID: 'http://154.41.209.93:7893/api/GetOfferByIdAPI?OfferId=',
        BookOffer: 'http://154.41.209.93:7895/api/BookOffer',
        RetriveItineraryDetails: '/api/Admin/RetriveItineraryDetails',
      },
    };

    let envMak = {
      offlineSeats: 'https://offlineseatsapi.mak-travel.com',
      searchflow: 'https://flightsearch.mak-travel.com',
      BookingFlow: 'https://flightflow.mak-travel.com',
      FareRules: 'https://flightprov.mak-travel.com/',
      asm: 'https://backofficeapi.mak-travel.com',
      Apihotels: 'https://hotelsflow.mak-travel.com/',
      users: 'https://usersapi.mak-travel.com',
      admin: 'https://adminapi.mak-travel.com/',
      getDPayment: 'https://adminapi.mak-travel.com/',
      bookHotels: 'https://hotelsflow.mak-travel.com',
      prepay: 'https://prepayapi.mak-travel.com',
      backOffice: 'https://backofficeapi.mak-travel.com',
      FlightTop: 'https://flightsearch.mak-travel.com',
      staticPages: 'https://stagingcms.round-pixel.net',
      offers: {
        getAll: 'http://154.41.209.74:3085/api/GetAllOffersAPI?POS=',
        getByID: 'http://154.41.209.74:3085/api/GetOfferByIdAPI?OfferId=',
        BookOffer: 'http://154.41.209.74:3085/api/BookOffer',
        RetriveItineraryDetails: '/api/Admin/RetriveItineraryDetails',
      },
    };
    let envWego = {
      offlineSeats: 'http://154.41.209.74:7025',
      searchflow: 'https://wegosearch.mak-travel.com',
      BookingFlow: 'https://wegobook.mak-travel.com',
      FareRules: 'https://wegoprovider.mak-travel.com',
      asm: 'https://backofficeapi.mak-travel.com',
      Apihotels: 'https://hotels.mak-travel.com',
      hotelprepay: 'https://prepayapi.mak-travel.com',
      users: 'https://usersapi.mak-travel.com',
      admin: 'https://adminapi.mak-travel.com/',
      getDPayment: 'https://adminapi.mak-travel.com/',
      bookHotels: 'https://hotels.mak-travel.com',
      prepay: 'https://prepayapi.mak-travel.com',
      backOffice: 'https://backofficeapi.mak-travel.com',
      FlightTop: 'https://wegosearch.mak-travel.com',
      offers: {
        getAll: 'http://41.215.243.138:7893/api/GetAllOffersAPI?POS=',
        getAllActive: 'http://41.215.243.138:7893/api/GetAllActiveOffersAPI?POS=',
        getByID: 'http://41.215.243.138:7893/api/GetOfferByIdAPI?OfferId=',
        BookOffer: 'http://41.215.243.138:7895/api/BookOffer',
        RetriveItineraryDetails: '/api/Admin/RetriveItineraryDetails',
      },
    };

    this.environmentService.envConfiguration(envWego);

    this.translate.setTranslation('en', en);
    this.translate.setTranslation('ar', ar);
    this.translate.setDefaultLang('en');

    const lang = localStorage.getItem('lang');

    if (lang) {
      this.translate.use(lang);
    } else {
      this.translate.use('en');
      localStorage.setItem('lang', 'en');
    }

    this.document.dir = this.translate.currentLang === 'ar' ? 'rtl' : 'ltr';
  }

  ngOnInit(): void {
    this.sharedService.screenWidth = window.innerWidth;
    this.mostSearchedFlightsService.getMostSearchedFlights();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.sharedService.screenWidth = window.innerWidth;
  }
}
