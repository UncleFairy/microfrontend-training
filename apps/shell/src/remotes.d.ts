declare module 'tradePanelA/TradePanel' {
  import { ComponentType } from 'react';

  export type OrderSide = 'Buy' | 'Sell';

  export type SubmittedOrder = {
    symbol: string;
    side: OrderSide;
    quantity: number;
    price: number;
  };

  export type TradePanelProps = {
    selectedSymbol?: string;
    onOrderSubmitted?: (order: SubmittedOrder) => void;
  };

  export const TradePanel: ComponentType<TradePanelProps>;
}

declare module 'tradePanelB/TradePanel' {
  import { ComponentType } from 'react';

  export type TradePanelProps = {
    onSymbolSelected?: (symbol: string) => void;
  };

  export const TradePanel: ComponentType<TradePanelProps>;
}
