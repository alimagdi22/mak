export interface ITotalFare {
  amount: number;
  fareAmount: number;
  promoCode: string | null;
  promoDiscount: number;
  currencyCode: string;
  totalTaxes: number;
  dName: string | null;
  mName: string | null;
}
