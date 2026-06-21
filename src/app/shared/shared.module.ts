import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { RpTravelUiModule } from 'rp-travel-ui';
import { MainButtonComponent } from './components/main-button/main-button.component';
import { SecondaryButtonComponent } from './components/secondary-button/secondary-button.component';
import { SessionTimeoutPopupComponent } from './components/session-timeout-popup/session-timeout-popup.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { DurationFormatPipe } from './pipes/duration-format.pipe';
import { FareFilterPipe } from './pipes/fare-filter.pipe';
import { FloorDecimalPipe } from './pipes/floor-decimal.pipe';
import { CustomDateRangePipe } from './pipes/pipe-month.pipe';
import { TimeFormatPipe } from './pipes/time-format.pipe';

const AngularMaterialModules = [
  MatProgressSpinnerModule,
  MatIconModule,
  MatExpansionModule,
  MatTabsModule,
  MatSliderModule,
  MatCheckboxModule,
  MatAutocompleteModule,
  MatOptionModule,
  MatInputModule,
  MatPaginatorModule,
  MatButtonModule,
  MatProgressBarModule,
];

const SharedComponents = [SessionTimeoutPopupComponent, SecondaryButtonComponent, MainButtonComponent];
const SharedDirectives = [ClickOutsideDirective];
const SharedPipes = [FloorDecimalPipe, CustomDateRangePipe, FareFilterPipe];

@NgModule({
  declarations: [...SharedDirectives, ...SharedComponents, ...SharedPipes],
  imports: [
    CommonModule,
    ...AngularMaterialModules,
    TranslateDirective,
    TranslatePipe,
    RpTravelUiModule,
    DurationFormatPipe,
    TimeFormatPipe,
  ],
  exports: [
    ...AngularMaterialModules,
    ...SharedDirectives,
    ...SharedPipes,
    SharedComponents,
    TranslateDirective,
    TranslatePipe,
    RpTravelUiModule,
  ],
})
export class SharedModule {}
