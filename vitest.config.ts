// Unit tests only (engine, ai, game, data, render math). The e2e flows are node scripts run by
// scripts/e2e.ts, never by vitest. Agents' worktrees under .claude/ carry their own copies.
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    exclude: [...configDefaults.exclude, '.claude/**', 'tests/e2e/**'],
    environment: 'node',
  },
});
