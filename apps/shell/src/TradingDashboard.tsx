import { useState, type ComponentType } from 'react';
import type { SubmittedOrder } from '@trading/trade-types';

export type TradePanelAProps = {
  selectedSymbol: string;
  onOrderSubmitted: (order: SubmittedOrder) => void;
};

export type TradePanelBProps = {
  onSymbolSelected: (symbol: string) => void;
};

type TradingDashboardProps = {
  TradePanelA: ComponentType<TradePanelAProps>;
  TradePanelB: ComponentType<TradePanelBProps>;
};

/**
 * This owns the real cross-panel state. Tests can provide the actual panel
 * components directly, while production provides federation-loading wrappers.
 */
export function TradingDashboard({
  TradePanelA,
  TradePanelB,
}: TradingDashboardProps) {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [latestOrder, setLatestOrder] = useState<SubmittedOrder | null>(null);

  return (
    <main className="app-shell">
      <header className="top-bar">
        <div>
          <p className="eyebrow">Host application · port 3000</p>
          <h1>Trading Workspace</h1>
        </div>
        <div className="shell-statuses">
          <span className="status">Market open</span>
          <span className="selection-status">Selected: {selectedSymbol}</span>
        </div>
      </header>

      {latestOrder && (
        <p className="order-received" role="status">
          Shell received: {latestOrder.side} {latestOrder.quantity}{' '}
          {latestOrder.symbol} at ${latestOrder.price.toFixed(2)}.
        </p>
      )}

      <section className="dashboard" aria-label="Trading dashboard">
        <TradePanelA
          selectedSymbol={selectedSymbol}
          onOrderSubmitted={setLatestOrder}
        />
        <TradePanelB onSymbolSelected={setSelectedSymbol} />
      </section>
    </main>
  );
}
