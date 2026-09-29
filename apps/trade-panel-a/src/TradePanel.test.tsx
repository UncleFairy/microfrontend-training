import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TradePanel } from './TradePanel';

describe('TradePanel A', () => {
  it('uses a new selected symbol supplied by the shell', () => {
    const { rerender } = render(<TradePanel selectedSymbol="AAPL" />);

    expect(screen.getByLabelText('Symbol')).toHaveValue('AAPL');

    rerender(<TradePanel selectedSymbol="BTC-USD" />);

    expect(screen.getByLabelText('Symbol')).toHaveValue('BTC-USD');
  });

  it('adds a submitted order and reports its stable domain payload', async () => {
    const user = userEvent.setup();
    const onOrderSubmitted = vi.fn();
    render(<TradePanel onOrderSubmitted={onOrderSubmitted} />);

    await user.clear(screen.getByLabelText('Symbol'));
    await user.type(screen.getByLabelText('Symbol'), 'nvda');
    await user.selectOptions(screen.getByLabelText('Side'), 'Sell');
    await user.clear(screen.getByLabelText('Quantity'));
    await user.type(screen.getByLabelText('Quantity'), '4');
    await user.clear(screen.getByLabelText('Limit price'));
    await user.type(screen.getByLabelText('Limit price'), '900.5');
    await user.click(screen.getByRole('button', { name: 'Submit sell order' }));

    expect(screen.getByRole('status')).toHaveTextContent('Sell order for 4 NVDA submitted.');
    expect(screen.getByRole('cell', { name: 'NVDA' })).toBeInTheDocument();
    expect(onOrderSubmitted).toHaveBeenCalledWith({
      symbol: 'NVDA',
      side: 'Sell',
      quantity: 4,
      price: 900.5,
    });
  });
});
