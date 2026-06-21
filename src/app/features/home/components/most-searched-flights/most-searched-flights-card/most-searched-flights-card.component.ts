import { Component, inject, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MostSearchedFlightsResponse } from '../interfaces';
import { MostSearchedFlightsService } from '../most-searched-flights.service';

@Component({
  selector: 'app-most-searched-flights-card',
  templateUrl: './most-searched-flights-card.component.html',
  styleUrl: './most-searched-flights-card.component.scss',
})
export class MostSearchedFlightsCardComponent {
  @Input({ required: true }) mostSearchedFlight!: MostSearchedFlightsResponse;

  mostSearchedFlightsService = inject(MostSearchedFlightsService);
  translate = inject(TranslateService);
}
