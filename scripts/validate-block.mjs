import {readFileSync} from 'node:fs';
import {validateBlock} from './runtime.mjs';
import {validateListing} from './catalog.mjs';
const args=process.argv.slice(2),index=args.indexOf('--listing');
if(!args[0]||args[0].startsWith('--')||args.length!==(index===-1?1:3)||index!==-1&&index!==1)throw new Error('Use: npm run validate:block -- BLOCK_FOLDER [--listing LISTING.json]');
const listing=index===-1?undefined:JSON.parse(readFileSync(args[2],'utf8'));
if(listing)validateListing(listing,args[2]);
console.log(JSON.stringify(validateBlock(args[0],listing),null,2));
