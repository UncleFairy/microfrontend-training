import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TradePanel } from './TradePanel';

describe('TradePanel B', () => {
  it('selects an instrument and reports it through the public callback', async () => {
    const user = userEvent.setup();
    const onSymbolSelected = vi.fn();
    render(<TradePanel onSymbolSelected={onSymbolSelected} />);

    const bitcoin = screen.getByRole('button', { name: /BTC-USD.*Bitcoin/i });
    await user.click(bitcoin);

    expect(bitcoin).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('heading', { name: 'BTC-USD' })).toBeInTheDocument();
    expect(onSymbolSelected).toHaveBeenCalledWith('BTC-USD');
  });
});
