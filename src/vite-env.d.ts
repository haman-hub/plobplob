/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_PASSWORD: string
  readonly VITE_APP_NAME: string
  readonly VITE_ADMIN_WALLET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}