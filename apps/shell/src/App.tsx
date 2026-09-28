import { lazy, Suspense } from 'react';

// These imports are resolved at runtime from the two remote applications.
// Each remote exports a named component, while React.lazy expects `default`.
const TradePanelA = lazy(() =>
  import('tradePanelA/TradePanel').then(({ TradePanel }) => ({ default: TradePanel }))
);
const TradePanelB = lazy(() =>
  import('tradePanelB/TradePanel').then(({ TradePanel }) => ({ default: TradePanel }))
);

export function App() {
  return (
    <main className="app-shell">
      <header className="top-bar">
        <div>
          <p className="eyebrow">Host application · port 3000</p>
          <h1>Trading Workspace</h1>
        </div>
        <span className="status">Market open</span>
      </header>

      <section className="dashboard" aria-label="Trading dashboard">
        <Suspense fallback={<PanelLoading name="Trade Panel A" />}>
          <TradePanelA />
        </Suspense>
        <Suspense fallback={<PanelLoading name="Trade Panel B" />}>
          <TradePanelB />
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
