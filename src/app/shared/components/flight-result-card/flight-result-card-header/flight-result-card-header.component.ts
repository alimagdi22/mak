import { Component, inject, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { IFlight } from 'rp-travel-ui';
import { SharedService } from '../../../shared.service';

@Component({
  selector: 'app-flight-result-card-header',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './flight-result-card-header.component.html',
  styleUrl: './flight-result-card-header.component.scss',
})
export class FlightResultCardHeaderComponent {
  @Input({ required: true }) flight!: IFlight;
  @Input() showTag = false;
  @Input() index = -1;

  public sharedService = inject(SharedService);
}
