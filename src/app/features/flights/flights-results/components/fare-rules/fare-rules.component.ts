import { Component, inject } from '@angular/core';
import { FlightResultService } from 'rp-travel-ui';

@Component({
  selector: 'app-fare-rules',
  templateUrl: './fare-rules.component.html',
  styleUrl: './fare-rules.component.scss',
})
export class FareRulesComponent {
  public FlightResultService = inject(FlightResultService);
}
