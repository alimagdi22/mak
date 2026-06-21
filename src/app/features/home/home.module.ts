import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { WhyUsComponent } from './components/why-us/why-us.component';
import { MostSearchedFlightsComponent } from './components/most-searched-flights/most-searched-flights.component';
import { MostPopularAirlinesComponent } from './components/most-popular-airlines/most-popular-airlines.component';
import { WhyUsCardComponent } from './components/why-us/why-us-card/why-us-card.component';
import { MostSearchedFlightsCardComponent } from './components/most-searched-flights/most-searched-flights-card/most-searched-flights-card.component';
import { FlightsSearchBoxComponent } from '../../shared/components/flights-search-box/flights-search-box.component';
import { CalcDiscountPipe } from './components/most-searched-flights/calc-discount.pipe';
import { MobileAppAdComponent } from './components/mobile-app-ad/mobile-app-ad.component';
import { A11yModule } from "@angular/cdk/a11y";

@NgModule({
  declarations: [
    HomeComponent,
    WhyUsComponent,
    MostSearchedFlightsComponent,
    MostPopularAirlinesComponent,
    WhyUsCardComponent,
    MostSearchedFlightsCardComponent,
    CalcDiscountPipe,
    MobileAppAdComponent,
  ],
  imports: [CommonModule, HomeRoutingModule, SharedModule, FlightsSearchBoxComponent, A11yModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule {}
