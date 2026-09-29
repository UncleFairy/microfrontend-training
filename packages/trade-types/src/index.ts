/**
 * Stable domain language shared across application boundaries.
 *
 * Feature-specific state and API clients deliberately do not belong here.
 */
export type OrderSide = 'Buy' | 'Sell';

export type Order = {
  id: number;
  symbol: string;
  side: OrderSide;
  quantity: number;
  price: number;
};

export type SubmittedOrder = Omit<Order, 'id'>;

export type Instrument = {
  symbol: string;
  name: string;
  price: number;
  change: number;
};
