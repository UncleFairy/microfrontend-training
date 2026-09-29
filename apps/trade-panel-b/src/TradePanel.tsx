import { useState } from 'react';
import { Card } from '@trading/shared-ui';
import type { Instrument } from '@trading/trade-types';
import './styles.css';

export type TradePanelProps = {
  // Optional so this remote remains usable on its own at port 3002.
  onSymbolSelected?: (symbol: string) => void;
};

const instruments: Instrument[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 195.2, change: 1.24 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 412.65, change: -0.38 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.28, change: 2.13 },
  { symbol: 'BTC-USD', name: 'Bitcoin', price: 64125.4, change: 0.71 }
];

/**
 * This feature owns market-watch display state while it is standalone.
 *
 * It owns its watchlist display state and tells the shell about a selection
 * through an explicit callback when it is embedded in the dashboard.
 */
export function TradePanel({ onSymbolSelected }: TradePanelProps) {
  const [selectedSymbol, setSelectedSymbol] = useState(instruments[0].symbol);
  const selectedInstrument = instruments.find(({ symbol }) => symbol === selectedSymbol) ?? instruments[0];

  function selectSymbol(symbol: string) {
    setSelectedSymbol(symbol);
    onSymbolSelected?.(symbol);
  }

  return (
    <main className="trade-panel">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Standalone remote candidate · port 3002</p>
          <h1>Market Watch</h1>
        </div>
        <span className="connection-status">Delayed prices</span>
      </header>

      <Card aria-labelledby="watchlist-title">
        <div className="section-heading">
          <h2 id="watchlist-title">Watchlist</h2>
          <span>Select an instrument</span>
        </div>

        <div className="watchlist" role="list">
          {instruments.map((instrument) => {
            const isSelected = instrument.symbol === selectedSymbol;
            const changeClass = instrument.change >= 0 ? 'positive' : 'negative';

            return (
              <button
                className={`instrument ${isSelected ? 'selected' : ''}`}
                key={instrument.symbol}
                type="button"
                onClick={() => selectSymbol(instrument.symbol)}
                aria-pressed={isSelected}
              >
                <span className="instrument-name">
                  <strong>{instrument.symbol}</strong>
                  <small>{instrument.name}</small>
                </span>
                <span className="instrument-price">
                  <strong>${instrument.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                  <small className={changeClass}>
                    {instrument.change >= 0 ? '+' : ''}{instrument.change.toFixed(2)}%
                  </small>
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="selected-detail" aria-labelledby="selected-instrument-title">
        <p className="eyebrow">Selected instrument</p>
        <h2 id="selected-instrument-title">{selectedInstrument.symbol}</h2>
        <p>
          {selectedInstrument.name} is selected here and shared with the shell,
          which passes it to the order-entry panel.
        </p>
      </Card>
    </main>
  );
}
