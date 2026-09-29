import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: new URL('.', import.meta.url).pathname,
  test: {
    environment: 'jsdom',
    setupFiles: './test/setup.ts',
    include: ['apps/**/*.test.tsx'],
  },
});
