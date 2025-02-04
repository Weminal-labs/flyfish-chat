/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_TASK_SERVICE_ENDPOINT: string;
  readonly VITE_IDENTITY_SERVICE_ENDPOINT: string;
  readonly VITE_MODE: string;
  // more env variables...
}
