import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  processFile: (filename: string) => ipcRenderer.invoke('process-file', filename),
  checkFile: (filename: string) => ipcRenderer.invoke('check-file', filename)
});
