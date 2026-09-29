import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  root: new URL('.', import.meta.url).pathname,
  resolve: {
    // Integration tests replace network-loaded remotes with contract-compatible
    // modules. Browser tests will cover the real federation runtime later.
    alias: {
      'tradePanelA/TradePanel': fileURLToPath(
        new URL('./test/mocks/tradePanelA.tsx', import.meta.url),
      ),
      'tradePanelB/TradePanel': fileURLToPath(
        new URL('./test/mocks/tradePanelB.tsx', import.meta.url),
      ),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './test/setup.ts',
    include: ['apps/**/*.test.tsx'],
  },
});
