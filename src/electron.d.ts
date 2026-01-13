export {};

interface ElectronAPI {
  processFile: (filename: string) => Promise<{ success: boolean; filePath?: string; timestamp?: number; error?: string }>;
  checkFile: (filename: string) => Promise<{ success: boolean; filePath?: string; timestamp?: number; error?: string }>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
