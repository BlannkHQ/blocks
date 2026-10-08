import { fileURLToPath } from 'node:url';
import { readCatalog } from './catalog.mjs';
const reservedConcepts=['tasks','reminders','quick-notes','focus-timer','command-shortcuts','theme-studio'].map(slug=>({slug}));
const blocks=readCatalog(fileURLToPath(new URL('../blocks/',import.meta.url)),reservedConcepts);
console.log(`Validated ${blocks.length} public Block listings. No source code downloaded or executed.`);
