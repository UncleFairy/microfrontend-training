import { lazy, Suspense, useState } from 'react';
import type { SubmittedOrder } from 'tradePanelA/TradePanel';

// These imports are resolved at runtime from the two remote applications.
// Each remote exports a named component, while React.lazy expects `default`.
const TradePanelA = lazy(() =>
  import('tradePanelA/TradePanel').then(({ TradePanel }) => ({ default: TradePanel }))
);
const TradePanelB = lazy(() =>
  import('tradePanelB/TradePanel').then(({ TradePanel }) => ({ default: TradePanel }))
);

export function App() {
  // The shell owns cross-panel state. The panels only receive data and report
  // events through their public props, so they stay independent of each other.
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
          Shell received: {latestOrder.side} {latestOrder.quantity} {latestOrder.symbol} at $
          {latestOrder.price.toFixed(2)}.
        </p>
      )}

      <section className="dashboard" aria-label="Trading dashboard">
        <Suspense fallback={<PanelLoading name="Trade Panel A" />}>
          <TradePanelA selectedSymbol={selectedSymbol} onOrderSubmitted={setLatestOrder} />
        </Suspense>
        <Suspense fallback={<PanelLoading name="Trade Panel B" />}>
          <TradePanelB onSymbolSelected={setSelectedSymbol} />
        </Suspense>
      </section>
    </main>
  );
}

type PanelLoadingProps = {
  name: string;
};

function PanelLoading({ name }: PanelLoadingProps) {
  return (
    <article className="panel-placeholder">
      <p className="eyebrow">Remote microfrontend</p>
      <h2>{name}</h2>
      <p className="waiting">Loading remote application…</p>
    </article>
  );
}
