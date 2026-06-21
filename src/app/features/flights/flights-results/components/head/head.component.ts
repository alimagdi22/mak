import { AfterViewInit, Component, ElementRef, inject, ViewChild, OnDestroy } from '@angular/core';
import { FlightResultService } from 'rp-travel-ui';
import { Subscription } from 'rxjs';
import { ISortItem } from '../../../../../shared/models/sortItem.model';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '../../../../../shared/shared.service';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

Swiper.use([Navigation]);

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.scss'],
})
export class HeadComponent implements AfterViewInit, OnDestroy {
  @ViewChild('desktopSwiper') desktopSwiperRef!: ElementRef;
  @ViewChild('swiperEl', { static: false }) swiperEl!: ElementRef;
  desktopSwiper?: Swiper;
  
  load: boolean = true;
  flightResultService = inject(FlightResultService);
  sharedService = inject(SharedService);
  isSearchBoxOpen = false;
  public translate = inject(TranslateService);
  currentLang = this.translate.currentLang;
  subscription = new Subscription();
  returnDate = '';
  sortItems: ISortItem[] = [
    {
      title: 'Cheapest',
      price: '',
      currency: '',
      isActive: true,
      sortCode: 1,
    },
    {
      title: 'Fastest',
      price: '',
      currency: '',
      isActive: false,
      sortCode: 2,
    },
  ];

  ngOnInit(): void {
    this.subscription.add(
      this.flightResultService.filterForm.valueChanges.subscribe(() => {
        this.sortItems.forEach((e) => (e.isActive = false));

        const retryUntilDataLoaded = async () => {
          let attempts = 0;
          const maxAttempts = 20;
          while (!this.flightResultService.orgnizedResponce.length && attempts < maxAttempts) {
            await new Promise((res) => setTimeout(res, 200));
            attempts++;
          }

          if (this.flightResultService.orgnizedResponce.length) {
            this.sortItems[0].isActive = true;
            this.sortItems[0].price = this.flightResultService.orgnizedResponce[0][0].itinTotalFare.amount;
            this.sortItems[0].currency = this.flightResultService.orgnizedResponce[0][0].itinTotalFare.currencyCode;
          }
        };

        retryUntilDataLoaded();
      }),
    );

    this.subscription.add(
      this.flightResultService.notify.subscribe({
        next: () => {
          if (this.flightResultService.orgnizedResponce.length > 0) {
            const lastFlight = this.flightResultService.orgnizedResponce[0][0].allJourney.flights;
            if (lastFlight.length > 0) {
              const lastFlightDTO = lastFlight[lastFlight.length - 1].flightDTO;
              if (lastFlightDTO.length > 0) {
                this.returnDate = lastFlightDTO[lastFlightDTO.length - 1].departureDate;
              }
            }
          }
        }
      })
    );

    setTimeout(() => {
      this.load = false;
    }, 7000);
  }

  ngAfterViewInit(): void {
    if (this.sharedService.screenWidth >= this.sharedService.webViewBreakPoint) {
      this.initDesktopSwiper();
    }
    
    const swiper = this.swiperEl?.nativeElement;
    if (swiper) {
      Object.assign(swiper, {
        spaceBetween: this.sharedService.screenWidth > this.sharedService.webViewBreakPoint ? 1 : 8,
        breakpoints: {
          0: { slidesPerView: 3 },
        },
      });
      swiper.initialize();
    }
  }

  initDesktopSwiper() {
    this.desktopSwiper = new Swiper(this.desktopSwiperRef.nativeElement, {
      modules: [Navigation],
      slidesPerView: 5,
      spaceBetween: 5,
      navigation: {
        nextEl: '.arrow-right',
        prevEl: '.arrow-left',
      },
    });
  }

  toggleSearchBox() {
    this.isSearchBoxOpen = !this.isSearchBoxOpen;
  }

  // FIXED: Use the service's method directly and let it handle the state
  chooseCustomFilterAirline(airline: any, index: number): void {
    console.log('Choosing airline:', airline.name, 'at index:', index);
    this.flightResultService.chooseCustomFilterAirline(airline, index);
  }

  // Helper method to check if airline is selected
  isAirlineSelected(airlineName: string): boolean {
    return this.flightResultService.checkCustomFilterAirline(airlineName);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.desktopSwiper) {
      this.desktopSwiper.destroy();
    }
  }
}