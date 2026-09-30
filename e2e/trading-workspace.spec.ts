import { expect, test } from '@playwright/test';

test('loads both federated panels and completes a trade workflow', async ({ page }) => {
  await page.goto('/');

  // These headings appear only after the shell has downloaded and rendered
  // each remote through its real remoteEntry.js container.
  await expect(page.getByRole('heading', { name: 'Order Entry' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Market Watch' })).toBeVisible();

  await page
    .getByRole('button', { name: /BTC-USD.*Bitcoin/ })
    .click();

  await expect(page.getByText('Selected: BTC-USD')).toBeVisible();
  await expect(page.getByLabel('Symbol')).toHaveValue('BTC-USD');

  await page.getByRole('button', { name: 'Submit buy order' }).click();

  await expect(page.getByText('Shell received: Buy 10 BTC-USD at $195.20.')).toBeVisible();
});
