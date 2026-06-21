import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IFlight } from 'rp-travel-ui';

@Component({
  selector: 'app-flight-result-card-stops',
  standalone: true,
  imports: [NgClass],
  templateUrl: './flight-result-card-stops.component.html',
  styleUrl: './flight-result-card-stops.component.scss',
})
export class FlightResultCardStopsComponent {
  @Input() flight!: IFlight;
  @Input() currentLang!: string;
}
