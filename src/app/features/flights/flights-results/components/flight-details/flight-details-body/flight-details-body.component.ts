import { Component, inject, Input } from '@angular/core';
import { FlightResultService, ISearchCriteria } from 'rp-travel-ui';

@Component({
  selector: 'app-flight-details-body',
  templateUrl: './flight-details-body.component.html',
  styleUrl: './flight-details-body.component.scss',
})
export class FlightDetailsBodyComponent {
  @Input() searchCriteria!: ISearchCriteria;
  flightResultService = inject(FlightResultService);
  
  links = [
    { id: 'tab1', title: 'Itinerary' },
    { id: 'tab2', title: 'Fare Rules' },
    { id: 'tab3', title: 'Baggage' },
  ];
  activeLink = this.links[0];

  trackByFn(index: number, item: any): string {
    return item.id;
  }
}
