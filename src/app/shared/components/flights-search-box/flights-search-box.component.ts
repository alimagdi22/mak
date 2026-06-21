import { SlicePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FlightResultService, FlightSearchService, HomePageService } from 'rp-travel-ui';
import { IResultLink } from '../../../core/models/resultLink.model';
import { FlightSharedService } from '../../../core/services/flightShared.service';
import { SharedService } from '../../shared.service';
import { DateInputComponent } from './date-input/date-input.component';
import { DestInputComponent } from './dest-input/dest-input.component';
import { TravellingInputComponent } from './travelling-input/travelling-input.component';
import { SearchboxLoaderComponent } from './searchbox-loader/searchbox-loader.component';

@Component({
  selector: 'app-flights-search-box',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DestInputComponent,
    DateInputComponent,
    TravellingInputComponent,
    SlicePipe,
    TranslatePipe,
    MatProgressSpinnerModule,
    SearchboxLoaderComponent,
  ],
  templateUrl: './flights-search-box.component.html',
  styleUrl: './flights-search-box.component.scss',
})
export class FlightsSearchBoxComponent implements OnInit, AfterViewInit {
  @ViewChild('onewayRadioInput') onewayRadioInput!: ElementRef;
  @ViewChild('roundtripRadioInput') roundtripRadioInput!: ElementRef;
  @ViewChild('multicityRadioInput') multicityRadioInput!: ElementRef;

  @Input() isInFlightResults = false;

  public homePageService = inject(HomePageService);
  public flightSearchService = inject(FlightSearchService);
  public flightSharedService = inject(FlightSharedService);
  public flightResultService = inject(FlightResultService);
  public translate = inject(TranslateService);
  public sharedService = inject(SharedService);
  public openReturnDateCalendar = 0;
  public isAddReturnSelected = false;
  public isSelectButtonLoading = false;
  public departingType: string = '';
  public landingType: string = '';
  public destinationType: string = 'Airport_Airport';
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private resultParams: IResultLink | null = null;
  ngOnInit(): void {
    let form = JSON.parse(localStorage.getItem('form') as string);

    if (form) {
      let cityPattern = form.Flights[0].departing;
      let pattern = /,/;

      if (!pattern.test(cityPattern)) {
        localStorage.removeItem('form');
      }
    } else {
      this.flightSearchService.searchFlight.get('flightType')?.setValue('RoundTrip');
    }

    this.flightSearchService.initSearchForm(form);
    this.restoreDestinationTypeFromCache();

    if (
      form &&
      this.sharedService.isSegmentPresent(['flights-results']) &&
      !this.sharedService.isSegmentPresent(['cheapestFlights'])
    ) {
      // this.onSubmit();
    }
  }
  private restoreDestinationTypeFromCache() {
    const departingSelections = JSON.parse(localStorage.getItem('departing') ?? '[]');
    const landingSelections = JSON.parse(localStorage.getItem('landing') ?? '[]');

    const departingType = this.getSelectionType(departingSelections?.[0]);
    const landingType = this.getSelectionType(landingSelections?.[0]);

    if (departingType) {
      this.departingType = departingType;
    }
    if (landingType) {
      this.landingType = landingType;
    }

    if (this.departingType && this.landingType) {
      this.destinationType = `${this.departingType}_${this.landingType}`;
      this.sharedService.destinationType = this.destinationType;
    }
  }

  private getSelectionType(selection: any): 'City' | 'Airport' | '' {
    if (!selection) {
      return '';
    }

    return selection._isCitySelection ? 'City' : 'Airport';
  }
  updateDestinationType(event: { dest: 'departing' | 'landing'; type: 'City' | 'Airport' }) {
    if (event.dest === 'departing') {
      this.departingType = event.type;
    } else if (event.dest === 'landing') {
      this.landingType = event.type;
    }

    // Combine when both have values
    if (this.departingType && this.landingType) {
      this.destinationType = `${this.departingType}_${this.landingType}`;
      this.sharedService.destinationType = this.destinationType; // Update shared service
    }
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      switch (this.flightSearchService.searchFlight.get('flightType')?.value) {
        case 'OneWay':
          this.onewayRadioInput.nativeElement.click();
          break;
        case 'RoundTrip':
          this.roundtripRadioInput.nativeElement.click();
          break;
        case 'MultiCity':
          this.multicityRadioInput.nativeElement.click();
          break;
      }
    }, 0);
  }

  switchDestination(item: AbstractControl) {
    this.flightSearchService.switchDestination(item);
    item.markAllAsTouched();
    this.flightSharedService.switchDestinations.next();

    const landing = localStorage.getItem('landing');
    const departing = localStorage.getItem('departing');

    localStorage.setItem('departing', landing ?? '');
    localStorage.setItem('landing', departing ?? '');
  }

  goToRoundTrip() {
    this.roundtripRadioInput.nativeElement.click();
    this.isAddReturnSelected = true;
  }

  onSubmit() {
    this.flightSearchService.flightsArray.at(0).markAllAsTouched();
    this.flightSearchService.searchFlight.get('returnDate')?.markAsTouched();
    this.isSelectButtonLoading = true;

    const lang = this.translate.currentLang;
    const currency = this.homePageService.selectedCurrency.Currency_Code;
    const resultLink = this.flightSearchService.onSubmit(
      lang,
      currency,
      this.homePageService.pointOfSale ? this.homePageService.pointOfSale.country! : 'EG',
      ',',
      this.sharedService.destinationType || this.destinationType,
    );

    let splittedLink = resultLink.toString().split('/');

    if (typeof resultLink == 'object') {
      Object.entries(resultLink).forEach(([key, value], index) => {
        if (lang == 'en') {
          if (value.enMsg != '') {
            // this.tinyAlert(value.enMsg);
          }
        } else {
          if (value.arMsg != '') {
            // this.tinyAlert(value.arMsg);
          }
        }
      });
      this.flightSearchService.searchFlight.updateValueAndValidity();
      this.isSelectButtonLoading = false;
    } else if (typeof resultLink == 'string' && resultLink != '') {
      // set land city from share service
      this.resultParams?.language;

      if (this.flightSearchService.searchFlight.valid) {
        this.resultParams = {
          language: splittedLink[0],
          currency: splittedLink[1],
          searchPoint: splittedLink[2],
          flightType: splittedLink[3],
          flightInfo: splittedLink[4],
          searchId: splittedLink[5],
          passengers: splittedLink[6],
          cabinClass: splittedLink[7],
          directOnly: splittedLink[8] === 'false' ? false : true,
          destinationType: splittedLink[9],
        };

        // this.sharedService.scrollToTop();
        this.router.navigate(['flights-results', ...splittedLink]);
        localStorage.setItem('form', JSON.stringify(this.flightSearchService.searchFlight.value));
        this.isSelectButtonLoading = false;
      } else {
        this.flightSearchService.searchFlight.markAllAsTouched();
        this.flightSearchService.searchFlight.get('returnDate')?.markAsTouched();
        this.isSelectButtonLoading = false;
      }
    }
  }

  onAddFlight() {
    let landingAirports = JSON.parse(localStorage.getItem('landing') ?? '[]');
    let airport = landingAirports[this.flightSearchService.flightsArray['controls'].length - 1];

    if (airport) {
      let departionAirports = JSON.parse(localStorage.getItem('departing') ?? '[]');
      departionAirports[this.flightSearchService.flightsArray['controls'].length] = airport;
      localStorage.setItem('departing', JSON.stringify(departionAirports));
    }

    this.flightSearchService.addFlight();
  }

  onRemoveFlight(index: number) {
    let departionAirports = JSON.parse(localStorage.getItem('departing') ?? '[]');
    let landingAirports = JSON.parse(localStorage.getItem('landing') ?? '[]');

    departionAirports[index] = null;
    landingAirports[index] = null;

    localStorage.setItem('departing', JSON.stringify(departionAirports));
    localStorage.setItem('landing', JSON.stringify(landingAirports));

    this.flightSearchService.removeFlight(index);
  }
}
