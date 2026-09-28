/**
 * For now, this is a regular React component.
 *
 * In step 5, the two placeholder sections will be replaced with components
 * downloaded from the Trade Panel A and Trade Panel B applications.
 */
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
        <PanelPlaceholder
          title="Trade Panel A"
          description="This area will become the order-entry and open-orders microfrontend."
          port="Future remote: port 3001"
        />
        <PanelPlaceholder
          title="Trade Panel B"
          description="This area will become the market-watchlist microfrontend."
          port="Future remote: port 3002"
        />
      </section>
    </main>
  );
}

type PanelPlaceholderProps = {
  title: string;
  description: string;
  port: string;
};

// Keeping this placeholder as a separate component makes the dashboard easier
// to read. Later, each use will be replaced by one remote React component.
function PanelPlaceholder({ title, description, port }: PanelPlaceholderProps) {
  return (
    <article className="panel-placeholder">
      <p className="eyebrow">{port}</p>
      <h2>{title}</h2>
      <p>{description}</p>
      <p className="waiting">Waiting for microfrontend implementation</p>
    </article>
  );
}
