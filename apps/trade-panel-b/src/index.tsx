import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TradePanel } from './TradePanel';
import './styles.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('The root element was not found. Check src/index.html.');
}

// This entry point is used only when Panel B runs by itself. In step 5, the
// shell will load the exported TradePanel component through Module Federation.
createRoot(rootElement).render(
  <StrictMode>
    <TradePanel />
  </StrictMode>
);
