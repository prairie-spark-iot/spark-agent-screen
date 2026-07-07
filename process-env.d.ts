// Process environment type declarations for the Spark IoT Agent.
// Extends NodeJS.ProcessEnv (Next.js server-side, not Vite/ImportMetaEnv).
// BACKEND_SOURCE_DEVICE / BACKEND_SOURCE_ALERT are strangler-fig flags:
// 'engine' → proxy to the real backend, 'mock' → use the in-memory DB.
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BACKEND_SOURCE_DEVICE: 'engine' | 'mock';
      BACKEND_ENGINE_URL: string;
      NEXT_PUBLIC_BACKEND_WS_URL: string;
      BACKEND_SOURCE_ALERT?: 'engine' | 'mock';
    }
  }
}
