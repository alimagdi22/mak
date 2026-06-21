import { Component, inject } from '@angular/core';
import { SharedService } from '../../../../../shared/shared.service';
import { FlightResultService } from 'rp-travel-ui';
import { FlightSharedService } from '../../../../../core/services/flightShared.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent {
  sharedService = inject(SharedService);
  flightResultService = inject(FlightResultService);
  flightSharedService = inject(FlightSharedService);
}
