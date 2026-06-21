import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlightsResultsComponent } from './flights-results.component';
import { FlightDetailsComponent } from './components/flight-details/flight-details.component';
import { FlightsCheckoutComponent } from '../flights-checkout/flights-checkout.component';

const routes: Routes = [
  {
    path: ':language/:currency/:SearchPoint/:flightType/:flightInfo/:searchId/:passengers/:Cclass/:directOnly/:destinationType',
    component: FlightsResultsComponent,
    pathMatch: 'full',
  },
  {
    path: ':language/:currency/:SearchPoint/:flightType/:flightInfo/:searchId/:passengers/:Cclass/:directOnly/:sequanceNum',
    component: FlightDetailsComponent,
    pathMatch: 'full',
  },
  {
    path: '',
    component: FlightsCheckoutComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlightsResultsRoutingModule {}
