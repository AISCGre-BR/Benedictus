import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as util from 'util';

const exec = util.promisify(child_process.exec);

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../index.html'));
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('process-file', async (event, filename: string) => {
  try {
    // Sanitization: Ensure we are working with a base filename, not a full path or malicious input
    // For this basic app, we assume the file is in the current working directory or a specific data dir.
    // Let's assume the user provides a name like "myscore" and we look in the CWD.
    
    // Remove extension if provided to standardize
    const baseName = path.parse(filename).name;
    const cwd = process.cwd(); // Or a specific directory

    console.log(`Processing: ${baseName} in ${cwd}`);

    // 1. lualatex FILE.tex
    // Interaction mode nonstopmode prevents hanging on errors
    const latexCommand = `lualatex -interaction=nonstopmode "${baseName}.tex"`;
    console.log(`Running: ${latexCommand}`);
    await exec(latexCommand, { cwd });

    // 2. pdf2svg FILE.pdf FILE.svg
    const pdf2svgCommand = `pdf2svg "${baseName}.pdf" "${baseName}.svg"`;
    console.log(`Running: ${pdf2svgCommand}`);
    await exec(pdf2svgCommand, { cwd });

    // Read the SVG content to send back, or just return the path
    const svgPath = path.join(cwd, `${baseName}.svg`);
    
    // Check if file exists
    if (!fs.existsSync(svgPath)) {
        throw new Error('SVG file was not generated.');
    }

    return { success: true, filePath: svgPath, timestamp: Date.now() };

  } catch (error: any) {
    console.error('Error processing file:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
});
