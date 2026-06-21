import { Component, inject } from '@angular/core';
import { FlightResultService } from 'rp-travel-ui';

@Component({
  selector: 'app-airlines-filter',
  templateUrl: './airlines-filter.component.html',
  styleUrl: './airlines-filter.component.scss',
})
export class AirlinesFilterComponent {
  flightResultService = inject(FlightResultService);
}
