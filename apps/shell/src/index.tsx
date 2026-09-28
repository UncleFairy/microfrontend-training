import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';

// `root` is the HTML element from index.html. React needs one element where it
// can manage the page.
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('The root element was not found. Check src/index.html.');
}

// StrictMode enables useful development checks. It does not add visible UI.
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
