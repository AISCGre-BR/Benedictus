import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  processFile: (filename: string) => ipcRenderer.invoke('process-file', filename)
});
