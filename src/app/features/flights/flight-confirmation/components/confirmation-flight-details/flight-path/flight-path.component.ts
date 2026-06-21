import { Component, inject, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FLIGHT_DEFAULT, IFlight } from 'rp-travel-ui';
import { SharedService } from '../../../../../../shared/shared.service';

@Component({
  selector: 'app-flight-path',
  templateUrl: './flight-path.component.html',
  styleUrl: './flight-path.component.scss',
})
export class FlightPathComponent {
  @Input() flight: IFlight = FLIGHT_DEFAULT;
  sharedService = inject(SharedService);

  translate = inject(TranslateService);
}
