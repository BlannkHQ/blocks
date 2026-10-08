import { readFileSync, readdirSync, lstatSync } from 'node:fs';
import { join, basename } from 'node:path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
const schema = JSON.parse(readFileSync(new URL('../schema/listing.schema.json', import.meta.url), 'utf8'));
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validate = ajv.compile(schema);
const reserved = new Set(['publish', 'private', 'catalog', 'listing-template', 'listing-schema']);
export function validateListing(entry, filename) {
 if (!validate(entry)) throw new Error(`${filename}: ${ajv.errorsText(validate.errors, {separator:'; '})}`);
 if (basename(filename) !== `${entry.slug}.json`) throw new Error(`${filename}: filename must match slug`);
 if (reserved.has(entry.slug)) throw new Error(`${filename}: reserved route name`);
 if (!entry.id.startsWith(`user.${entry.author.toLowerCase()}.`)) throw new Error(`${filename}: id must be namespaced to the author`);
 if (!entry.slug.startsWith(`${entry.author.toLowerCase()}-`)) throw new Error(`${filename}: slug must start with the author followed by a hyphen`);
 if (entry.author === 'your-github-handle' || /^0{40}$/.test(entry.commit)) throw new Error(`${filename}: replace template placeholders`);
 if (entry.repository.split('/').at(-1) === '.' || entry.repository.split('/').at(-1) === '..') throw new Error(`${filename}: invalid repository`);
 for (const value of [entry.name, entry.summary, entry.description]) {
  if (!value.trim() || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) throw new Error(`${filename}: invalid text`);
 }
 return entry;
}
export function readCatalog(directory, examples = []) {
 const entries = [];
 const slugs = new Set(examples.map(item => item.slug));
 const ids = new Set();
 for (const name of readdirSync(directory).sort()) {
  if (name === '.gitkeep') continue;
  const file = join(directory, name);
  const stat = lstatSync(file);
  if (!stat.isFile() || stat.isSymbolicLink() || !name.endsWith('.json') || stat.size > 32768) throw new Error(`${name}: catalog accepts regular JSON listing files under 32 KB only`);
  const entry = validateListing(JSON.parse(readFileSync(file, 'utf8')), name);
  if (slugs.has(entry.slug) || ids.has(entry.id)) throw new Error(`${name}: duplicate slug or ID`);
  slugs.add(entry.slug); ids.add(entry.id); entries.push(entry);
 }
 return entries.sort((a,b) => a.slug.localeCompare(b.slug, 'en'));
}
export function validateRepository(repository) {
 if (repository !== null && (typeof repository !== 'string' || !/^https:\/\/github\.com\/[A-Za-z0-9-]+\/[A-Za-z0-9_-][A-Za-z0-9_.-]*$/.test(repository))) throw new Error('registry/config.json: use null or a GitHub repository URL without credentials, query parameters or a trailing slash');
 return repository;
}
