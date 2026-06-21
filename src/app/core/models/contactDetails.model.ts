export interface PhoneDetails {
  number: string;
  internationalNumber: string;
  nationalNumber: string;
  e164Number: string;
  countryCode: string;
  dialCode: string;
}

export interface ContactDetails {
  email: string;
  phone: PhoneDetails;
  country: string;
  countryCode: string;
}
