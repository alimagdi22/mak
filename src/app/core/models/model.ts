export interface IGetSelectedFlight {
  searchId: string;
  sequenceNum: number;
  providerKey: string;
  userCombinedNames?: boolean;
  pcc: string;
}

export interface FareRulesResponse{
  errorMessage: string;
  fares:FareRules[];
}

export interface FareRules {
  departureCountry: string;
  arrivalCountry: string;
  adtRules: Fares[];
  cnnRules: Fares[];
  infRules: Fares[];
}

export interface Fares {
  fareRule: string;
  title: string;
}