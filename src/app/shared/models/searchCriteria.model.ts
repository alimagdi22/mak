import { IFlightSearch } from './flightSearch.model';

export interface ISearchCriteria {
  searchResultReturned: boolean;
  searchId: string;
  source: string;
  device: string | null;
  pos: string;
  currency: string;
  language: string;
  flights: IFlightSearch[];
  flightType: string;
  preferredAirline: string | null;
  selectedFlightClass: string;
  adultNum: number;
  childNum: number;
  infantNum: number;
  totalPassengersNum: number;
  selectDirectFlightsOnly: boolean;
  childAges: number;
  infantAges: number;
}
