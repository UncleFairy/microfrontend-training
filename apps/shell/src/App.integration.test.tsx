import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('the shell and remote contracts', () => {
  it('passes a remote watchlist selection to order entry and receives its order', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByRole('button', { name: 'Select BTC-USD' }));

    expect(screen.getByText('Selected: BTC-USD')).toBeInTheDocument();
    expect(await screen.findByText('Order symbol: BTC-USD')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Submit mock order' }));

    expect(screen.getByRole('status')).toHaveTextContent(
      'Shell received: Buy 3 BTC-USD at $200.00.',
    );
  });
});
