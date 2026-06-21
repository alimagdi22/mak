import { Component, inject } from '@angular/core';
import { SharedService } from '../../../../../../shared/shared.service';
import { IBaggageInformation } from 'rp-travel-ui';

@Component({
  selector: 'app-baggage-information',
  standalone: true,
  templateUrl: './baggage-information.component.html',
  styleUrl: './baggage-information.component.scss',
})
export class BaggageInformationComponent {
  sharedService = inject(SharedService);
  baggageInfo: IBaggageInformation = this.sharedService.selectedFlightItinerary.baggageInformation[0];

  get normalBaggage() {
    const baggage = this.baggageInfo.baggage.split(' ');

    if (baggage[1] === 'Kilograms') {
      return Math.floor(parseInt(baggage[0]) / 7);
    }

    return baggage[0];
  }

  get getUnit() {
    const baggage = this.baggageInfo.baggage.split(' ');

    if (baggage[1] === 'Kilograms') {
      return 'KGs';
    }

    return 'PCs';
  }

  adultBaggage() {
    const baggage = this.baggageInfo.baggage.split(' ');

    if (baggage[1] === 'Kilograms') {
      return Math.floor(parseInt(baggage[0]) / 7);
    }

    return baggage[0];
  }

  childBaggage() {
    const baggage = this.baggageInfo.childBaggage?.split(' ');

    if (baggage) {
      if (baggage[1] === 'Kilograms') {
        return Math.floor(parseInt(baggage[0]) / 7);
      }

      return baggage[0];
    }

    return 'N/A';
  }

  infantBaggage() {
    const baggage = this.baggageInfo.infantBaggage?.split(' ');

    if (baggage) {
      if (baggage[1] === 'Kilograms') {
        return Math.floor(parseInt(baggage[0]) / 7);
      }

      return baggage[0];
    }

    return 'N/A';
  }
}
