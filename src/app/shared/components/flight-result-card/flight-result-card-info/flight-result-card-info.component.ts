import { Component, Input } from '@angular/core';
import { IFlight, IFlightDTO,  } from 'rp-travel-ui';
import { TimeFormatPipe } from '../../../pipes/time-format.pipe';
import { FlightResultCardStopsComponent } from '../flight-result-card-stops/flight-result-card-stops.component';

@Component({
  selector: 'app-flight-result-card-info',
  standalone: true,
  imports: [TimeFormatPipe, FlightResultCardStopsComponent],
  templateUrl: './flight-result-card-info.component.html',
  styleUrl: './flight-result-card-info.component.scss',
})
export class FlightResultCardInfoComponent {
  @Input({ required: true }) flightSegment!: IFlightDTO;
  @Input({ required: true }) isDepart!: boolean;
  @Input() show: boolean = false;
  @Input() flight!: IFlight;
  @Input() currentLang!: string;
}
