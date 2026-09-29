type TradePanelProps = {
  onSymbolSelected?: (symbol: string) => void;
};

/** A contract-compatible remote used only while testing the shell. */
export function TradePanel({ onSymbolSelected }: TradePanelProps) {
  return (
    <section aria-label="Mock Trade Panel B">
      <button type="button" onClick={() => onSymbolSelected?.('BTC-USD')}>
        Select BTC-USD
      </button>
    </section>
  );
}
