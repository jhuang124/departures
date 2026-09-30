import { defineConfig } from 'vite';

// Dev (`npm run dev`, or an agent's own `npx vite --port <p>`): served at the root, so the game is
// http://127.0.0.1:<p>/ and the sandboxes are /land.html, /trains.html, /audio-lab.html, /ui-gallery.html.
//
// Build and `vite preview` (`npm run preview:pages`): base '/departures/', the GitHub Pages subpath
// (https://jhuang124.github.io/departures/). Every asset URL in dist carries the prefix.
//
// VITE_E2E=1 (set by scripts/e2e.ts for its build) keeps the window.__dep test hooks in the production
// bundle (src/main.ts, src/game/hooks.ts). DEP_E2E=1 (set by `scripts/e2e.ts --dev`) turns off HMR and
// file watching, so an edit mid-run can't reload the page under a running flow.
const e2eDev = !!process.env.DEP_E2E;

export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/departures/' : '/',
  server: { host: '127.0.0.1', ...(e2eDev ? { hmr: false, watch: null } : {}) },
  preview: { host: '127.0.0.1' },
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 2000,
    // The shipped game is index.html only; the sandboxes are dev-server pages.
    rollupOptions: { input: 'index.html' },
  },
}));
