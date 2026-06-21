import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightsCheckoutComponent } from './flights-checkout.component';
import { FlightsCheckoutRoutingModule } from './flights-checkout-routing.module';
import { BrandedFaresComponent } from './components/step-one/components/branded-fares/branded-fares.component';
import { SharedModule } from '../../../shared/shared.module';
import { StepOneComponent } from './components/step-one/step-one.component';
import { StepTwoComponent } from './components/step-two/step-two.component';
import { LoginSectionComponent } from './components/step-two/components/login-section/login-section.component';
import { ContactDetailsComponent } from './components/step-two/components/contact-details/contact-details.component';
import { TravellersDetailsComponent } from './components/step-two/components/travellers-details/travellers-details.component';
import { PaymentMethodComponent } from './components/step-two/components/payment-method/payment-method.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlightResultCardComponent } from '../../../shared/components/flight-result-card/flight-result-card.component';
import { FlightCardSkeletonLoaderComponent } from '../../../shared/components/flight-card-skeleton-loader/flight-card-skeleton-loader.component';
import { FlightResultsPageCardComponent } from '../../../shared/components/flight-results-page-card/flight-results-page-card.component';
import { CheckoutCardComponent } from './components/step-one/components/checkout-card/checkout-card.component';
import { DurationFormatPipe } from '../../../shared/pipes/duration-format.pipe';
import { TimeFormatPipe } from '../../../shared/pipes/time-format.pipe';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input-gg';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FareBreakdownComponent } from './components/step-two/components/fare-breakdown/fare-breakdown.component';
import { CountrySelectionModalComponent } from './components/step-two/components/travellers-details/country-selection-modal/country-selection-modal.component';
import { BrandedFareInfoModalComponent } from './components/step-one/components/branded-fare-info-modal/branded-fare-info-modal.component';
const components = [
  FlightsCheckoutComponent,
  BrandedFaresComponent,
  StepOneComponent,
  StepTwoComponent,
  FareBreakdownComponent,
  CountrySelectionModalComponent,
  BrandedFareInfoModalComponent,
];

@NgModule({
  declarations: [
    ...components,
    LoginSectionComponent,
    ContactDetailsComponent,
    TravellersDetailsComponent,
    PaymentMethodComponent,
    CheckoutCardComponent,
  ],
  imports: [
    CommonModule,
    FlightsCheckoutRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderComponent,
    FlightResultCardComponent,
    FlightCardSkeletonLoaderComponent,
    FlightResultsPageCardComponent,
    DurationFormatPipe,
    TimeFormatPipe,
    NgxIntlTelInputModule,
    NgbDatepickerModule,
    BsDatepickerModule,
  ],
})
export class FlightsCheckoutModule {}
