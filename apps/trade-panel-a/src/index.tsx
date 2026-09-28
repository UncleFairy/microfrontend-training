import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TradePanel } from './TradePanel';
import './styles.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('The root element was not found. Check src/index.html.');
}

// When this app runs alone, it renders its trade panel directly. Later, the
// shell will load this same TradePanel component as a remote module.
createRoot(rootElement).render(
  <StrictMode>
    <TradePanel />
  </StrictMode>
);
