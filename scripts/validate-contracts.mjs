import {readdirSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {validateBlock} from './runtime.mjs';
const root=fileURLToPath(new URL('../examples/native/',import.meta.url));
const contract=JSON.parse(readFileSync(new URL('../contracts/os-contract.json',import.meta.url),'utf8'));
for(const folder of readdirSync(root).sort())validateBlock(join(root,folder));
console.log(`Validated native examples against runtime contract v${contract.runtimeSchemaVersion}, pinned to OS ${contract.source.commit}. No QML executed.`);
