export interface ITax {
  taxCode: string;
  amount: number;
  taxName: string | null;
  taxCurrencyCode: string;
  content: string;
  countryCode: string | null;
}
