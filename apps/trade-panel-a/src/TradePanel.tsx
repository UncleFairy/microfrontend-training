import { FormEvent, useEffect, useState } from 'react';
import { Button, Card } from '@trading/shared-ui';
import type { Order, OrderSide, SubmittedOrder } from '@trading/trade-types';
import './styles.css';

export type { OrderSide, SubmittedOrder } from '@trading/trade-types';

export type TradePanelProps = {
  // Optional so this remote remains usable on its own at port 3001.
  selectedSymbol?: string;
  onOrderSubmitted?: (order: SubmittedOrder) => void;
};

const initialOrders: Order[] = [
  { id: 1, symbol: 'AAPL', side: 'Buy', quantity: 10, price: 195.2 },
  { id: 2, symbol: 'MSFT', side: 'Sell', quantity: 5, price: 412.65 }
];

/**
 * This is the feature component owned by Trade Panel A.
 *
 * It owns its local form state, while the shell can provide a symbol and be
 * notified after an order is submitted through this small public contract.
 */
export function TradePanel({ selectedSymbol, onOrderSubmitted }: TradePanelProps) {
  const [symbol, setSymbol] = useState(selectedSymbol ?? 'AAPL');
  const [side, setSide] = useState<OrderSide>('Buy');
  const [quantity, setQuantity] = useState(10);
  const [price, setPrice] = useState(195.2);
  const [orders, setOrders] = useState(initialOrders);
  const [message, setMessage] = useState('');

  // A watchlist selection is an intentional cross-panel action, so it
  // replaces the form symbol when the shell supplies a new value.
  useEffect(() => {
    if (selectedSymbol) {
      setSymbol(selectedSymbol);
    }
  }, [selectedSymbol]);

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // A real application would call an order API here. For this learning
    // example, add the order to local state so the result is immediately clear.
    const order: Order = {
      id: Date.now(),
      symbol: symbol.trim().toUpperCase(),
      side,
      quantity,
      price
    };

    setOrders((currentOrders) => [order, ...currentOrders]);
    setMessage(`${order.side} order for ${order.quantity} ${order.symbol} submitted.`);
    onOrderSubmitted?.({
      symbol: order.symbol,
      side: order.side,
      quantity: order.quantity,
      price: order.price
    });
  }

  return (
    <main className="trade-panel">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Standalone remote candidate · port 3001</p>
          <h1>Order Entry</h1>
        </div>
        <span className="connection-status">Simulated account</span>
      </header>

      <Card aria-labelledby="new-order-title">
        <h2 id="new-order-title">New order</h2>
        <form className="order-form" onSubmit={submitOrder}>
          <label>
            Symbol
            <input
              value={symbol}
              onChange={(event) => setSymbol(event.target.value)}
              maxLength={12}
              required
            />
          </label>

          <label>
            Side
            <select value={side} onChange={(event) => setSide(event.target.value as OrderSide)}>
              <option>Buy</option>
              <option>Sell</option>
            </select>
          </label>

          <label>
            Quantity
            <input
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              min="1"
              required
            />
          </label>

          <label>
            Limit price
            <input
              type="number"
              value={price}
              onChange={(event) => setPrice(Number(event.target.value))}
              min="0.01"
              step="0.01"
              required
            />
          </label>

          <Button className="submit-order" type="submit">
            Submit {side.toLowerCase()} order
          </Button>
        </form>
        {message && <p className="success-message" role="status">{message}</p>}
      </Card>

      <Card aria-labelledby="open-orders-title">
        <div className="section-heading">
          <h2 id="open-orders-title">Open orders</h2>
          <span>{orders.length} total</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Side</th>
                <th>Quantity</th>
                <th>Limit price</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.symbol}</td>
                  <td className={order.side === 'Buy' ? 'buy' : 'sell'}>{order.side}</td>
                  <td>{order.quantity}</td>
                  <td>${order.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  );
}
