import { Injectable } from '@angular/core';
import { IAirItinerary } from 'rp-travel-ui';
import { Subject } from 'rxjs';
import { IAirPortTranslated } from '../models/airport.model';
import { TFlightType } from '../models/flightType.model';

@Injectable({
  providedIn: 'root',
})
export class FlightSharedService {
  cities: IAirPortTranslated[] = [];
  selectedFlightType: TFlightType = 'roundtrip';
  selectedFlight: IAirItinerary[] = [];
  switchDestinations = new Subject<void>();
}
