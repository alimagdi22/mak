import { Component, inject } from '@angular/core';
import { FlightResultService } from 'rp-travel-ui';

@Component({
  selector: 'app-stops-filter',
  templateUrl: './stops-filter.component.html',
  styleUrl: './stops-filter.component.scss',
})
export class StopsFilterComponent {
  flightResultService = inject(FlightResultService);

  stopsFilter = [
    {
      title: 'Non-Stop',
      formControlName: 'noStops',
    },
    {
      title: '1 Stop',
      formControlName: 'oneStop',
    },
    {
      title: '2 Stop',
      formControlName: 'twoAndm',
    },
  ];
}
