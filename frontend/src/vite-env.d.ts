/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_HOST: string;
  // Agrega aquí todas las variables que uses
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
