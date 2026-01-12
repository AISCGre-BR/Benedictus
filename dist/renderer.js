"use strict";
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
const processBtn = document.getElementById('processBtn');
const fileInput = document.getElementById('filenameInput');
const statusDiv = document.getElementById('status');
const resultDiv = document.getElementById('result');
processBtn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    const filename = fileInput.value.trim();
    if (!filename) {
        statusDiv.innerText = 'Please enter a filename.';
        return;
    }
    statusDiv.innerText = `Processing '${filename}'...`;
    resultDiv.innerHTML = '';
    processBtn.disabled = true;
    try {
        const response = yield window.electronAPI.processFile(filename);
        if (response.success && response.filePath) {
            statusDiv.innerText = 'Success!';
            // Add a cache-busting timestamp to ensure the image refreshes
            const svgUrl = `${response.filePath}?t=${response.timestamp}`;
            // Displaying local file needs file:// protocol usually, but since we have strict context isolation, 
            // the renderer might not be allowed to load local resources directly without configuration or reading the content in main.
            // However, let's try setting the src to the local path first. 
            // If that fails due to security (which is good practice), we might need to read the file in main and pass the content.
            // For a "basic" app without a bundler, the file:// protocol *might* work if webSecurity is not too strict or if we are just careful.
            // Actually, best practice is to handle this via `fs` in main and send content, OR use a custom protocol.
            // Let's assume for this basic step we just try to load the image. 
            // Electron often blocks direct local file access from renderer for security.
            // RE-PLAN: It's safer and more robust to just load it as an image if we can, or embed it.
            // Let's create an img tag.
            const img = document.createElement('img');
            img.src = svgUrl;
            img.style.maxWidth = '100%';
            resultDiv.appendChild(img);
        }
        else {
            statusDiv.innerText = `Error: ${response.error}`;
        }
    }
    catch (err) {
        statusDiv.innerText = `Error calling backend: ${err.message}`;
    }
    finally {
        processBtn.disabled = false;
    }
}));
