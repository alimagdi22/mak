import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ExpansionComponent } from '../../../shared/components/expansion/expansion.component';
import { FlightResultCardComponent } from '../../../shared/components/flight-result-card/flight-result-card.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { SharedModule } from '../../../shared/shared.module';
import { FareRulesComponent } from './components/fare-rules/fare-rules.component';
import { AirlinesFilterComponent } from './components/filter/airlines-filter/airlines-filter.component';
import { FilterComponent } from './components/filter/filter.component';
import { MaxMinComponent } from './components/filter/price-filter/max-min/max-min.component';
import { PriceFilterComponent } from './components/filter/price-filter/price-filter.component';
import { RefundabilityFilterComponent } from './components/filter/refundability-filter/refundability-filter.component';
import { StopsFilterComponent } from './components/filter/stops-filter/stops-filter.component';
import { FlightDetailsComponent } from './components/flight-details/flight-details.component';
import { HeadComponent } from './components/head/head.component';
import { SortComponent } from './components/sort/sort.component';
import { FlightsResultsRoutingModule } from './flights-results-routing.module';
import { FlightsResultsComponent } from './flights-results.component';
import { FlightsSearchBoxComponent } from '../../../shared/components/flights-search-box/flights-search-box.component';
import { FlightCardSkeletonLoaderComponent } from '../../../shared/components/flight-card-skeleton-loader/flight-card-skeleton-loader.component';
import { MatMenuModule } from '@angular/material/menu';
import { FlightResultsPageCardComponent } from '../../../shared/components/flight-results-page-card/flight-results-page-card.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { BaggageInfoComponent } from '../../../shared/components/flight-results-page-card/baggage/baggage-info/baggage-info.component';
import { FlightDetailsHeaderComponent } from './components/flight-details/flight-details-header/flight-details-header.component';
import { FlightDetailsBodyComponent } from './components/flight-details/flight-details-body/flight-details-body.component';
import { BaggageDetailsComponent } from './components/flight-details/flight-details-body/baggage-details/baggage-details.component';
import { ItineraryComponent } from './components/flight-details/flight-details-body/itinerary/itinerary.component';
import { FlightPathComponent } from './components/flight-details/flight-details-body/itinerary/flight-path/flight-path.component';
import { BrandedFareRulesComponent } from './components/flight-details/flight-details-body/branded-fare-rules/branded-fare-rules.component';
import { SchedulesComponent } from './components/filter/schedules/schedules.component';
import { ScheduleTabComponent } from './components/filter/schedules/schedule-tab/schedule-tab.component';
import { ScheduleOptionComponent } from './components/filter/schedules/schedule-option/schedule-option.component';
import { TimeFormatTransitPipe } from '../../../shared/pipes/time-format-transit.pipe';

@NgModule({
  declarations: [
    FlightsResultsComponent,
    FilterComponent,
    AirlinesFilterComponent,
    StopsFilterComponent,
    RefundabilityFilterComponent,
    PriceFilterComponent,
    MaxMinComponent,
    FlightDetailsComponent,
    FareRulesComponent,
    HeadComponent,
    SortComponent,
    FlightDetailsHeaderComponent,
    FlightDetailsBodyComponent,
    BaggageDetailsComponent,
    BrandedFareRulesComponent,
    ItineraryComponent,
    FlightPathComponent,
    SchedulesComponent,
    ScheduleTabComponent,
    ScheduleOptionComponent
  ],
  imports: [
    BaggageInfoComponent,
    CommonModule,
    FlightsResultsRoutingModule,
    ReactiveFormsModule,
    ExpansionComponent,
    LoaderComponent,
    SharedModule,
    FlightResultCardComponent,
    FlightsSearchBoxComponent,
    FlightCardSkeletonLoaderComponent,
    FlightResultsPageCardComponent,
    MatMenuModule,
    SkeletonLoaderComponent,
    HeaderComponent,
    TimeFormatTransitPipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FlightsResultsModule {}
