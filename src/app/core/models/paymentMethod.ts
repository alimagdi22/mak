export interface IPaymentGateway {
    cardImg: string;
    GatewayType: string;
    Currency: string;
    Amount: number;
    PaymentMethod: string;
}