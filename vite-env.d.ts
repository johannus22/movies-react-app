/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APPWRITE_DATABASE_ID: string;
    readonly VITE_APPWRITE_COLLECTION_ID: string;
    readonly VITE_APPWRITE_PROJECT_ID: string;
    // add more environment variables here as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }