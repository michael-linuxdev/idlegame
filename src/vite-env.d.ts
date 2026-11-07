/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  /** `farm` | `turmfarm` | `arcade` | `tokenhalle` — selects theme skin at build time. */
  readonly VITE_THEME?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
