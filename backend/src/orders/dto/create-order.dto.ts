export class CreateOrderDto {
  restaurantId: string;
  items: { menuItemId: string; quantity: number }[];
  deliveryAddress: string;
  paymentMethod: 'CASH_ON_DELIVERY';
}
