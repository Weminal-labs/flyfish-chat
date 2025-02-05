/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_ATOMA_BASE_URL: string;
  readonly VITE_ATOMA_API_KEY: string;
  readonly VITE_FLYFISH_BASE_URL: string;
  // more env variables...
}
