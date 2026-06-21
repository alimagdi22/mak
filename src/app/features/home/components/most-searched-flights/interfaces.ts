import { IAirPortTranslated } from "../../../../core/models/airport.model";

export interface MostSearchedFlightsResponse {
  flightKey: string;
  searchCriteria: SearchCriteria;
  cheapestAirItinerary: CheapestAirItinerary;
  searchCount: number;
  discountPercentage: number;
  originalPrice: number;
}

export interface SearchCriteria {
  searchResultReturned: boolean;
  searchId: string;
  source: string;
  device: any;
  pos: string;
  currency: string;
  language: string;
  flights: FlightSearch[];
  flightType: string;
  preferredAirline: any;
  selectedFlightClass: string;
  adultNum: number;
  childNum: number;
  infantNum: number;
  totalPassengersNum: number;
  selectDirectFlightsOnly: boolean;
  childAges: number;
  infantAges: number;
}

export interface FlightSearch {
  departingFrom: string;
  arrivingTo: string;
  departingOnDate: string;
  departingAirport?: IAirPortTranslated;
  arrivingAirport?: IAirPortTranslated;
}

export interface CheapestAirItinerary {
  id: any;
  referralLink: string;
  sequenceNum: number;
  pKey: string;
  pcc: string;
  isRefundable: boolean;
  itinTotalFare: ItinTotalFare;
  totalDuration: number;
  isBaseBrand: boolean;
  deptDate: string;
  arrivalDate: string;
  cabinClass: string;
  flightType: string;
  allJourney: AllJourney;
  baggageInformation: BaggageInformation[];
  passengerFareBreakDownDTOs: PassengerFareBreakDownDTO[];
}

export interface ItinTotalFare {
  amount: number;
  fareAmount: number;
  promoCode: any;
  promoDiscount: number;
  currencyCode: string;
  totalTaxes: number;
  dName: string;
  dValue: any;
  mName: string | null;
}

export interface AllJourney {
  flights: JourneyFlight[];
}

export interface JourneyFlight {
  flightDTO: FlightDTO[];
  flightAirline: Airline;
  elapsedTime: number;
  stopsNum: number;
}

export interface FlightDTO {
  departureOffset: number;
  arrivalOffset: number;
  isStopSegment: boolean;
  deptTime: string;
  landTime: string;
  departureDate: string;
  arrivalDate: string;
  flightAirline: Airline;
  operatedAirline: Airline;
  durationPerLeg: number;
  departureTerminalAirport: TerminalAirport;
  arrivalTerminalAirport: TerminalAirport;
  transitTime: string;
  flightInfo: FlightInfo;
  segmentDetails: SegmentDetails;
  supplierRefID: any;
}

export interface Airline {
  airlineCode: string | null;
  airlineName: string | null;
  airlineLogo: string | null;
  alternativeBusinessName: string | null;
  passportDetailsRequired: boolean;
}

export interface TerminalAirport {
  airportCode: string;
  airportName: string;
  cityName: string;
  cityCode: string;
  countryCode: string;
  countryName: string;
  regionName: string;
  terminal: string;
  cityImage: string | null;
}

export interface FlightInfo {
  flightNumber: string;
  equipmentNumber: string;
  mealCode: string;
  bookingCode: string;
  cabinClass: string;
}

export interface SegmentDetails {
  uniqueKey: string;
  baggage: string;
  childBaggage: string;
  infantBaggage: string;
}

export interface BaggageInformation {
  baggage: string;
  childBaggage: string;
  infantBaggage: string;
  airlineName: string | null;
  deptCity: string;
  landCity: string;
  flightNum: string;
}

export interface PassengerFareBreakDownDTO {
  key: string;
  pricingMethod: string;
  cancelPenaltyDTOs: PenaltyDTO[];
  changePenaltyDTOs: PenaltyDTO[];
  passengerQuantity: number;
  passengerType: string;
  passengersRef: string[];
  flightFaresDTOs: FlightFareDTO[];
  taxes: Tax[];
}

export interface PenaltyDTO {
  price: number;
  curency: string;
  percentage: number;
  percentageApplied: boolean;
  applied: boolean;
  sector: string | null;
  time: string | null;
}

export interface FlightFareDTO {
  fareAmount: number;
  fareType: string;
  currencyCode: string;
}

export interface Tax {
  taxCode: string;
  amount: number;
  taxName: string | null;
  taxCurrencyCode: string;
  content: string;
  countryCode: string | null;
}
