/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** '1' in the e2e build (scripts/e2e.ts): keep window.__dep in the production bundle */
  readonly VITE_E2E?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
