import type { SubmittedOrder } from '@trading/trade-types';

type TradePanelProps = {
  selectedSymbol?: string;
  onOrderSubmitted?: (order: SubmittedOrder) => void;
};

/** A contract-compatible remote used only while testing the shell. */
export function TradePanel({ selectedSymbol, onOrderSubmitted }: TradePanelProps) {
  return (
    <section aria-label="Mock Trade Panel A">
      <p>Order symbol: {selectedSymbol}</p>
      <button
        type="button"
        onClick={() =>
          onOrderSubmitted?.({
            symbol: selectedSymbol ?? 'AAPL',
            side: 'Buy',
            quantity: 3,
            price: 200,
          })
        }
      >
        Submit mock order
      </button>
    </section>
  );
}
