"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const child_process = __importStar(require("child_process"));
const fs = __importStar(require("fs"));
const util = __importStar(require("util"));
const exec = util.promisify(child_process.exec);
function createWindow() {
    const mainWindow = new electron_1.BrowserWindow({
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
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('activate', function () {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
electron_1.ipcMain.handle('process-file', (event, filename) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield exec(latexCommand, { cwd });
        // 2. pdf2svg FILE.pdf FILE.svg
        const pdf2svgCommand = `pdf2svg "${baseName}.pdf" "${baseName}.svg"`;
        console.log(`Running: ${pdf2svgCommand}`);
        yield exec(pdf2svgCommand, { cwd });
        // Read the SVG content to send back, or just return the path
        const svgPath = path.join(cwd, `${baseName}.svg`);
        // Check if file exists
        if (!fs.existsSync(svgPath)) {
            throw new Error('SVG file was not generated.');
        }
        return { success: true, filePath: svgPath, timestamp: Date.now() };
    }
    catch (error) {
        console.error('Error processing file:', error);
        return { success: false, error: error.message || 'Unknown error' };
    }
}));
