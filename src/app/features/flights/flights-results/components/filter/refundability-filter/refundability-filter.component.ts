import { Component, inject } from '@angular/core';
import { FlightResultService } from 'rp-travel-ui';

@Component({
  selector: 'app-refundability-filter',
  templateUrl: './refundability-filter.component.html',
  styleUrl: './refundability-filter.component.scss',
})
export class RefundabilityFilterComponent {
  flightResultService = inject(FlightResultService);
}
