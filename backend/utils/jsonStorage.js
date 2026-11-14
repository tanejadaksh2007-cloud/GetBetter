import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

/**
 * Reads a JSON file from the data directory.
 * @param {string} filename - Name of file, e.g. 'coaches.json'
 * @returns {any} Parsed JSON data
 */
export function readJson(filename) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  try {
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error parsing JSON from ${filename}:`, err);
    return [];
  }
}

/**
 * Writes data safely to a JSON file in the data directory.
 * @param {string} filename - Name of file, e.g. 'vods.json'
 * @param {any} data - Data to stringify and write
 */
export function writeJson(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
