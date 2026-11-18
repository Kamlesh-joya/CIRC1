/**
 * CircuitCare Catalogue Import Script
 * Reads CircuitCare_Services(1).xlsx and regenerates backend/data/services.json
 * Preserves required fields, strips internal notes/links, never marks blank as free.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pythonScript = path.join(__dirname, 'importCatalogue.py');

console.log('[CircuitCare] Running catalogue import from Excel...');

const py = spawn('python', [pythonScript], { stdio: 'inherit' });

py.on('close', (code) => {
  if (code === 0) {
    console.log('[CircuitCare] Catalogue successfully imported!');
  } else {
    console.error(`[CircuitCare] Import failed with exit code ${code}`);
    process.exit(code);
  }
});
