declare module 'tradePanelA/TradePanel' {
  import { ComponentType } from 'react';
  import type { SubmittedOrder } from '@trading/trade-types';

  export type { SubmittedOrder } from '@trading/trade-types';

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
