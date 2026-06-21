import { Routes } from '@angular/router';
import { AboutUsComponent } from './features/home/components/about-us/about-us.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../app/features/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'flights-results',
    loadChildren: () =>
      import('../app/features/flights/flights-results/flights-results.module').then((m) => m.FlightsResultsModule),
  },
  {
    path: 'flights-checkout',
    loadChildren: () =>
      import('../app/features/flights/flights-checkout/flights-checkout.module').then((m) => m.FlightsCheckoutModule),
  },
  {
    path: 'user-management',
    loadChildren: () =>
      import('../app/features/user-management/user-management.module').then((m) => m.UserManagementModule),
  },
  {
    path: 'paymentresult',
    loadChildren: () =>
      import('./features/flights/flight-confirmation/flight-confirmation.module').then(
        (m) => m.FlightConfirmationModule,
      ),
  },
];
