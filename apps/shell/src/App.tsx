import {
  Component,
  lazy,
  Suspense,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Button, Card } from "@trading/shared-ui";
import {
  TradingDashboard,
  type TradePanelAProps,
  type TradePanelBProps,
} from './TradingDashboard';

export function App() {
  return (
    <TradingDashboard
      TradePanelA={RemoteTradePanelA}
      TradePanelB={RemoteTradePanelB}
    />
  );
}

function RemoteTradePanelA({
  selectedSymbol,
  onOrderSubmitted,
}: TradePanelAProps) {
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

function RemoteTradePanelB({ onSymbolSelected }: TradePanelBProps) {
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
        <Card className="panel-unavailable" role="alert">
          <p className="eyebrow">Remote microfrontend unavailable</p>
          <h2>{this.props.name}</h2>
          <p>
            It could not be loaded. Check that its service is available, then
            try again.
          </p>
          <Button
            className="retry-button"
            onClick={this.props.onRetry}
            type="button"
            variant="warning"
          >
            Retry {this.props.name}
          </Button>
        </Card>
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
    <Card className="panel-placeholder">
      <p className="eyebrow">Remote microfrontend</p>
      <h2>{name}</h2>
      <p className="waiting">Loading remote application…</p>
    </Card>
  );
}
