// flights-checkout-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlightsCheckoutComponent } from './flights-checkout.component';
import { StepOneComponent } from './components/step-one/step-one.component';
import { StepTwoComponent } from './components/step-two/step-two.component';
import { MPGSAuthComponent } from './components/mpgs-auth/mpgs-auth.component';

const routes: Routes = [
  {
    path: '',
    component: FlightsCheckoutComponent,
    children: [
      { path: 'step-one', component: StepOneComponent },
      { path: 'step-two', component: StepTwoComponent },
      {path:'mpgs-auth',component:MPGSAuthComponent},
      { path: '', redirectTo: 'step-one', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlightsCheckoutRoutingModule {}
