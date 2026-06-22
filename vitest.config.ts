import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // Vitest sets NODE_ENV=test automatically — like ASP.NET Core's Test host.
    restoreMocks: true,
    clearMocks: true,
  },
});
