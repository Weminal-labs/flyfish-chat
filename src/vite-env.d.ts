/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_ATOMA_BASE_URL: string;
  readonly VITE_ATOMA_API_KEY: string;
  readonly VITE_FLYFISH_BASE_URL: string;
  readonly VITE_TUSKY_API_KEY: string;
  readonly VITE_TUS_API: string;
  readonly VITE_DEFAULT_VAULT_ID: string;
  readonly VITE_DEFAULT_PARENT_ID: string;
  // more env variables...
}
