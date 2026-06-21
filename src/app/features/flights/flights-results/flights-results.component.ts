import { Location } from '@angular/common';
import { Component, ElementRef, HostListener, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FlightResultService, IAirItinerary } from 'rp-travel-ui';
import { fromEvent, map, startWith, Subscription } from 'rxjs';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { ISortItem } from '../../../shared/models/sortItem.model';
import { SharedService } from '../../../shared/shared.service';
@Component({
  selector: 'app-flights-results',
  templateUrl: './flights-results.component.html',
  styleUrl: './flights-results.component.scss',
})
export class FlightsResultsComponent implements OnInit, OnDestroy {
  constructor(private location: Location) {}
  @ViewChild('filterComponent') filterComponent!: ElementRef;

  flightResultService = inject(FlightResultService);
  details: IAirItinerary[] = [];
  public translate = inject(TranslateService);
  route = inject(ActivatedRoute);
  sharedService = inject(SharedService);
  gtmService = inject(GoogleTagManagerService);
  searchId!: string;
  subscription = new Subscription();

  sortItems: ISortItem[] = [
    {
      title: 'Cheapest',
      price: '',
      currency: '',
      isActive: false,
      sortCode: 1,
    },
    {
      title: 'Fastest',
      price: '',
      currency: '',
      isActive: false,
      sortCode: 2,
    },
    {
      title: 'earliest',
      price: '',
      currency: '',
      isActive: false,
      sortCode: 3,
    },
    {
      title: 'latest',
      price: '',
      currency: '',
      isActive: false,
      sortCode: 4,
    },
  ];

  showFilterComponent = false;

  filterHeight = 0;
  screenHeight = 0;
  isSessionExpired = false;

  ngOnInit(): void {
    this.subscription.add(
      this.route.params.subscribe((params: Params) => {
        console.log(params, 'params');
        console.log(this.sharedService.isFirstRequest, 'isFirstRequest');
        console.log(localStorage.getItem('form'), 'form');

        // if (this.sharedService.isFirstRequest && localStorage.getItem('form')) {
        //   this.sharedService.isFirstRequest = false;
        //   return;
        // }
        this.sharedService.searchParams = params;
        let lang = params['language'];
        let currency = params['currency'];
        let pointOfReservation = params['SearchPoint'];
        let flightType = params['flightType'];
        let flightsInfo = params['flightInfo'];
        let preferredAirLine = params['preferredAirLine'];

        let serachId = params['searchId'];
        let passengers = params['passengers'];
        let Cclass = params['Cclass'];
        let destinationType = params['destinationType'];

        let showDirect: boolean;

        if (params['directOnly'] == 'false') {
          showDirect = false;
        } else {
          showDirect = true;
        }
        this.searchId = params['searchId'];
        this.flightResultService.getDataFromUrl(
          lang,
          currency,
          pointOfReservation,
          flightType,
          flightsInfo,
          serachId,
          passengers,
          Cclass,
          showDirect,
          destinationType,
          5,
          2,
        );
      }),
    );

    this.subscription.add(
      this.flightResultService.notify.subscribe({
        next: () => {
          if (!this.flightResultService.orgnizedResponce.length) {
            return;
          }
          for (let i = 0; i < this.sortItems.length; i++) {
            this.flightResultService.sortMyResult(i + 1);

            this.sortItems[i].price = this.flightResultService.orgnizedResponce[0][0].itinTotalFare.amount;
            this.sortItems[i].currency = this.flightResultService.orgnizedResponce[0][0].itinTotalFare.currencyCode;
          }
          this.flightResultService.sortMyResult(1);

          this.sortItems[0].price = this.flightResultService.orgnizedResponce[0][0].itinTotalFare.amount;
          this.sortItems[0].currency = this.flightResultService.orgnizedResponce[0][0].itinTotalFare.currencyCode;

          setTimeout(() => {
            this.filterHeight = this.filterComponent?.nativeElement.offsetHeight;
            this.screenHeight = window.innerHeight;
          }, 1000);

          setTimeout(() => {
            this.isSessionExpired = true;
          }, 1200000);

          // Push GTM event when results are loaded
          this.gtmService.pushTag({
            event: 'search_results_view',
            page: 'flights-results',
            searchId: this.searchId,
            timestamp: new Date().toISOString(),
          });
        },
      }),
    );

    this.subscription.add(
      this.flightResultService.filterForm.valueChanges.subscribe(() => {
        if (!this.flightResultService.orgnizedResponce.length) {
          return;
        }
        for (let i = 0; i < this.sortItems.length; i++) {
          this.flightResultService.sortMyResult(i + 1);

          this.sortItems[i].price = this.flightResultService.orgnizedResponce[0][0].itinTotalFare.amount;
          this.sortItems[i].currency = this.flightResultService.orgnizedResponce[0][0].itinTotalFare.currencyCode;
        }
        this.flightResultService.sortMyResult(1);

        this.sortItems[0].price = this.flightResultService.orgnizedResponce[0][0].itinTotalFare.amount;
        this.sortItems[0].currency = this.flightResultService.orgnizedResponce[0][0].itinTotalFare.currencyCode;
      }),
    );

    this.subscription.add(
      this.flightResultService.brandedFareNotifier.subscribe({
        next: () => {
          if (this.flightResultService.currentSelectedBrands.length) {
            this.sharedService.selectedBrandedIndex = 0;
          } else {
            this.sharedService.selectedBrandedIndex = -1;
          }
        },
      }),
    );

    this.subscription.add(
      fromEvent(document, 'visibilitychange')
        .pipe(
          map(() => !document.hidden),
          startWith(!document.hidden),
        )
        .subscribe({
          next: (isVisible) => {
            if (isVisible && this.isSessionExpired) location.reload();
          },
        }),
    );
  }

  ngAfterViewInit(): void {
    // Access height after view initialization
    this.filterHeight = this.filterComponent?.nativeElement.offsetHeight;
  }

  toggleComponent() {
    this.showFilterComponent = !this.showFilterComponent;
  }

  closeComponent() {
    this.showFilterComponent = false;
  }

  ngOnDestroy(): void {
    this.sharedService.isFirstRequest = true;
    this.sharedService.isSessionTimeoutModalShowed = false;
    this.subscription.unsubscribe();
    this.flightResultService.destroyer();
  }

  goBack() {
    this.location.back();
  }
}
