import {
  Component,
  lazy,
  Suspense,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { SubmittedOrder } from "tradePanelA/TradePanel";

export function App() {
  // The shell owns cross-panel state. The panels only receive data and report
  // events through their public props, so they stay independent of each other.
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
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
          Shell received: {latestOrder.side} {latestOrder.quantity}{" "}
          {latestOrder.symbol} at ${latestOrder.price.toFixed(2)}.
        </p>
      )}

      <section className="dashboard" aria-label="Trading dashboard">
        <RemoteTradePanelA
          selectedSymbol={selectedSymbol}
          onOrderSubmitted={setLatestOrder}
        />
        <RemoteTradePanelB onSymbolSelected={setSelectedSymbol} />
      </section>
    </main>
  );
}

type RemoteTradePanelAProps = {
  selectedSymbol: string;
  onOrderSubmitted: (order: SubmittedOrder) => void;
};

function RemoteTradePanelA({
  selectedSymbol,
  onOrderSubmitted,
}: RemoteTradePanelAProps) {
  const [attempt, setAttempt] = useState(0);
  // A new lazy component retries the federation request after a failed import.
  const TradePanelA = useMemo(
    () =>
      lazy(() =>
        import("tradePanelA/TradePanel").then(({ TradePanel }) => ({
          default: TradePanel,
        })),
      ),
    [attempt],
  );

  return (
    <RemoteErrorBoundary
      key={attempt}
      name="Trade Panel A"
      onRetry={() => setAttempt((value) => value + 1)}
    >
      <Suspense fallback={<PanelLoading name="Trade Panel A" />}>
        <TradePanelA
          selectedSymbol={selectedSymbol}
          onOrderSubmitted={onOrderSubmitted}
        />
      </Suspense>
    </RemoteErrorBoundary>
  );
}

type RemoteTradePanelBProps = {
  onSymbolSelected: (symbol: string) => void;
};

function RemoteTradePanelB({ onSymbolSelected }: RemoteTradePanelBProps) {
  const [attempt, setAttempt] = useState(0);
  // Keep this import separate so Panel B can fail and retry independently.
  const TradePanelB = useMemo(
    () =>
      lazy(() =>
        import("tradePanelB/TradePanel").then(({ TradePanel }) => ({
          default: TradePanel,
        })),
      ),
    [attempt],
  );

  return (
    <RemoteErrorBoundary
      key={attempt}
      name="Trade Panel B"
      onRetry={() => setAttempt((value) => value + 1)}
    >
      <Suspense fallback={<PanelLoading name="Trade Panel B" />}>
        <TradePanelB onSymbolSelected={onSymbolSelected} />
      </Suspense>
    </RemoteErrorBoundary>
  );
}

type RemoteErrorBoundaryProps = {
  children: ReactNode;
  name: string;
  onRetry: () => void;
};

type RemoteErrorBoundaryState = {
  hasError: boolean;
};

class RemoteErrorBoundary extends Component<
  RemoteErrorBoundaryProps,
  RemoteErrorBoundaryState
> {
  state: RemoteErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): RemoteErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // In a production app, send this error and the remote version to monitoring.
    console.error(`${this.props.name} could not be loaded.`, error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <article className="panel-unavailable" role="alert">
          <p className="eyebrow">Remote microfrontend unavailable</p>
          <h2>{this.props.name}</h2>
          <p>
            It could not be loaded. Check that its service is available, then
            try again.
          </p>
          <button
            className="retry-button"
            type="button"
            onClick={this.props.onRetry}
          >
            Retry {this.props.name}
          </button>
        </article>
      );
    }

    return this.props.children;
  }
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
