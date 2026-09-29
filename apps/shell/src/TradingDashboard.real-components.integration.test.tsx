import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { TradePanel as TradePanelA } from '../../trade-panel-a/src/TradePanel';
import { TradePanel as TradePanelB } from '../../trade-panel-b/src/TradePanel';
import { TradingDashboard } from './TradingDashboard';

describe('the shell with real panel components', () => {
  it('shares a watchlist selection with order entry and receives the submitted order', async () => {
    const user = userEvent.setup();
    render(<TradingDashboard TradePanelA={TradePanelA} TradePanelB={TradePanelB} />);

    await user.click(
      screen.getByRole('button', { name: /BTC-USD.*Bitcoin/i }),
    );

    expect(screen.getByText('Selected: BTC-USD')).toBeInTheDocument();
    expect(screen.getByLabelText('Symbol')).toHaveValue('BTC-USD');

    await user.click(screen.getByRole('button', { name: 'Submit buy order' }));

    expect(screen.getByText(
      'Shell received: Buy 10 BTC-USD at $195.20.',
    )).toBeInTheDocument();
  });
});
