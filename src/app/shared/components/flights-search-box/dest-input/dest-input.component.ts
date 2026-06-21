import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FlightSearchService, RpTravelUiModule } from 'rp-travel-ui';
import { of, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import {
  initialRecommendedAirports,
} from '../../../../core/constants/recommendedAirports';
import { IAirPort, IAirPortTranslated } from '../../../../core/models/airport.model';
import { TDestinations } from '../../../../core/models/destiations.model';
import { FlightSharedService } from '../../../../core/services/flightShared.service';
import { SharedService } from '../../../shared.service';
import { InputHeaderComponent } from '../input-header/input-header.component';
import { style } from '@angular/animations';

@Component({
  selector: 'app-dest-input',
  standalone: true,
  imports: [
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    RpTravelUiModule,
    InputHeaderComponent,
    TranslatePipe,
  ],
  templateUrl: './dest-input.component.html',
  styleUrl: './dest-input.component.scss',
  host: {
    style: 'flex-grow: 1'
  }
})
export class DestInputComponent implements OnInit, OnDestroy {
  @Input({ required: true }) destination: TDestinations = 'landing';
  @Input({ required: true }) flightItem: AbstractControl = new FormControl();
  @Input({ required: true }) index = -1;

  @ViewChild('destinationInput', { static: true }) inputRef!: ElementRef;
@Output() destinationTypeChange = new EventEmitter<{ 
  dest: 'departing' | 'landing'; 
  type: 'City' | 'Airport'; 
}>();

  public translate = inject(TranslateService);
  public flightSharedService = inject(FlightSharedService);
  public flightSearchService = inject(FlightSearchService);
  public sharedService = inject(SharedService);
  public isLoading = false;

  private subscription = new Subscription();
  private searchSubject = new Subject<string>();
  private renderer = inject(Renderer2);
  private modalService = inject(NgbModal);
  private initialRecommendedAirports = initialRecommendedAirports;

  ngOnInit(): void {
    this.updateInputValue(this.flightItem.get(this.destination)?.value);

    this.subscription.add(
      this.flightSharedService.switchDestinations.subscribe({
        next: () => {
          this.updateInputValue(this.flightItem.get(this.destination)?.value);
        },
      }),
    );

    this.subscription.add(
      this.searchSubject
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          switchMap((searchTerm) => {
            if (!searchTerm?.trim()) {
              this.isLoading = false;
              return of([]);
            }
            this.isLoading = true;
            return this.flightSearchService.getAirports(searchTerm).pipe(
              catchError(() => {
                this.isLoading = false;
                return of([]);
              }),
            );
          }),
          map((data: any) => {
            data.length = 5;
            return data;
          })
        )
        .subscribe({
          next: (data) => {
            this.isLoading = false;
            this.flightSharedService.cities = data as IAirPortTranslated[];
          },
          error: () => {
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
          }
        }),
    );

    let form = JSON.parse(localStorage.getItem('form') as string);
    let airports = JSON.parse(localStorage.getItem(this.destination) as string) as (IAirPortTranslated & { _isCitySelection?: boolean })[];
    
    if (form && airports[this.index]) {
      const cachedAirport = airports[this.index];
      
      if (cachedAirport._isCitySelection) {
        const selectedCity = `${cachedAirport[this.sharedService.lang].cityName},${cachedAirport[this.sharedService.lang].cityCode}`;
        this.flightItem.get(this.destination)?.setValue(selectedCity);
        const displayValue = `${cachedAirport[this.sharedService.lang].cityName}, ${cachedAirport[this.sharedService.lang].countryName}`;
        this.updateInputValue(displayValue);
      } else {
        this.onSelectAirport(this.destination, cachedAirport[this.sharedService.lang]);
        // const currentValue = this.flightItem.get(this.destination)?.value;
        // if ((!currentValue || currentValue.trim() === '') && form && airports[this.index]) {
        //   this.onSelectAirport(this.destination, airports[this.index][this.sharedService.lang]);
        // }
      }
    }
  }

  updateInputValue(newValue: string): void {
    this.renderer.setProperty(this.inputRef.nativeElement, 'value', newValue);
  }

  onChangeDestination(dest: TDestinations) {
    this.flightItem.get(dest)?.markAsTouched();
    this.flightItem.get(dest)?.setValue('');
  }

  onInputDestination(e: Event): void {
    const searchString = (e.target as HTMLInputElement).value;

    this.isLoading = true;
    this.searchSubject.next(searchString);
  }

  onSelectAirport(dest: TDestinations, airport: IAirPort, isFromGroup: boolean = false) {
    const selectedAirport = airport.cityName + ',' + airport.airportCode;

    this.flightItem.get(dest)?.setValue(selectedAirport);
    this.updateInputValue(selectedAirport);
    this.flightSharedService.cities = [];
    this.modalService.dismissAll();
    
    // If it's from a grouped selection, store with city selection flag
    if (isFromGroup && 'cityCode' in airport) {
      this.storageAirport(dest, airport as any, false);
    }
    
    this.emitDestinationType(dest, false);
  }

  onSelectCity(dest: TDestinations, airport: IAirPortTranslated) {
    // Set the form value to "cityName,cityCode" to match the airport format
    const selectedCity = `${airport[this.sharedService.lang].cityName},${airport[this.sharedService.lang].cityCode}`;
    this.flightItem.get(dest)?.setValue(selectedCity);
    
    // Display cityName and countryName in the input
    const displayValue = `${airport[this.sharedService.lang].cityName}, ${airport[this.sharedService.lang].countryName}`;
    this.updateInputValue(displayValue);
    
    // Store the airport with city selection flag
    this.storageAirport(dest, airport, true);
    
    this.flightSharedService.cities = [];
    this.modalService.dismissAll();
    this.emitDestinationType(dest, true);
  }
private emitDestinationType(dest: TDestinations, isCity: boolean) {
  const type = isCity ? 'City' : 'Airport';
  this.destinationTypeChange.emit({ dest, type });
}
  getGroupedCities(): {city: string, country: string, airports: IAirPortTranslated[]}[] {
    const groups: {[key: string]: {city: string, country: string, airports: IAirPortTranslated[]}} = {};
    
    this.flightSharedService.cities.forEach(airport => {
      const lang = this.sharedService.lang;
      const cityKey = airport[lang].cityName + '|' + airport[lang].countryName;
      
      if (!groups[cityKey]) {
        groups[cityKey] = {
          city: airport[lang].cityName,
          country: airport[lang].countryName,
          airports: []
        };
      }
      groups[cityKey].airports.push(airport);
    });

    return Object.values(groups);
  }

  storageAirport(dest: TDestinations, airport: IAirPortTranslated, isCitySelection: boolean = false) {
    let airports = JSON.parse(localStorage.getItem(this.destination) ?? '[]');
    // Store both the airport data and whether it was a city selection
    airports[this.index] = {
      ...airport,
      _isCitySelection: isCitySelection // Add a flag to indicate city selection
    };
    localStorage.setItem(dest, JSON.stringify(airports));
  }

  onClickInput(template: TemplateRef<any>) {
    if (this.sharedService.screenWidth < 992) {
      const modal = this.modalService.open(template, { fullscreen: true });

      modal.closed.subscribe({
        complete: () => {
          this.flightSharedService.cities = [];
        },
      });
    }
  }

  getRecommendedAirports(): IAirPortTranslated[] {
    return this.initialRecommendedAirports;
  }

  isDestNotValid(index: number, dest: TDestinations) {
    return this.flightItem.get(dest)?.invalid && this.flightItem.get(dest)?.touched;
  }

  isTheSameDestination(index: number) {
    return this.flightItem.errors?.['sameLocation'];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
