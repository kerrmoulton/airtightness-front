/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV: 'development' | 'test' | 'production'
  readonly VITE_API_BASE: string
  readonly VITE_WS_BASE: string
  readonly VITE_APP_TITLE: string
  readonly VITE_API_TIMEOUT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 