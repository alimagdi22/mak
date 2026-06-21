import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { ICardModel } from 'rp-travel-ui';

@Component({
  selector: 'app-flight-card',
  templateUrl: './flight-card.component.html',
  styleUrls: ['./flight-card.component.scss'],
})
export class FlightCardComponent {
  @Input() trip: ICardModel = {
    airline: '',
    bookingRef: '',
    dates: '',
    flightType: '',
    itineraryNumber: '',
    route: '',
    ticketNumber: [],
    cityImage: '',
  };

  trigger = false;

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/image/userPage/image.png';
  }

  get flightType() {
    let type;

    switch (this.trip.flightType.toLowerCase()) {
      case 'oneway':
        type = 'One Way';
        break;
      case 'return':
        type = 'Round Trip';
        break;
      case 'multitrip':
        type = 'Multi Trip';
        break;
    }

    return type;
  }
}
