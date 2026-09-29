import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TradePanel } from './TradePanel';
import '@trading/shared-ui/styles.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('The root element was not found. Check src/index.html.');
}

createRoot(rootElement).render(
  <StrictMode>
    <TradePanel />
  </StrictMode>
);
