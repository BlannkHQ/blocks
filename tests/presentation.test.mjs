import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,cpSync,rmSync,symlinkSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {PNG} from 'pngjs';
import {validateBlock} from '../scripts/runtime.mjs';
import {validateListing} from '../scripts/catalog.mjs';
const base=JSON.parse(readFileSync(new URL('../blocks/erictherobot-minesweeper.json',import.meta.url)));
const listing=()=>({...base,schemaVersion:2,tags:['puzzle'],presentation:{icon:'timer',screenshot:{path:'screen.png',alt:'A running timer'}} ,presentationEvidence:{screenshot:{sha256:'a'.repeat(64),width:430,height:470,mediaType:'image/png'}}});
test('v1 remains valid; v2 icon is optional',()=>{validateListing(base,base.slug+'.json');const b=listing();delete b.presentation.icon;validateListing(b,b.slug+'.json');});
for(const [label,mutate] of [
 ['v1 presentation',b=>b.schemaVersion=1],['unsupported icon',b=>b.presentation.icon='not-shipped'],['icon URL',b=>b.presentation.icon='https://example.test/icon.svg'],['path traversal',b=>b.presentation.screenshot.path='../screen.png'],['empty path segment',b=>b.presentation.screenshot.path='a//screen.png'],['non PNG',b=>b.presentation.screenshot.path='screen.svg'],['missing evidence',b=>delete b.presentationEvidence],['bad hash',b=>b.presentationEvidence.screenshot.sha256='oops'],['pixel bound',b=>{b.presentationEvidence.screenshot.width=4096;b.presentationEvidence.screenshot.height=4096;}],['orphan evidence',b=>delete b.presentation.screenshot],['duplicate tags',b=>b.tags=['puzzle','puzzle']],['capital tags',b=>b.tags=['Puzzle']]
])test(`rejects ${label}`,()=>{const b=listing();mutate(b);assert.throws(()=>validateListing(b,b.slug+'.json'));});
function fixture(fn){const root=mkdtempSync(join(tmpdir(),'block-media-'));try{cpSync(new URL('../examples/native/timer/',import.meta.url),root,{recursive:true});const doc=JSON.parse(readFileSync(join(root,'block.json')));doc.schemaVersion=2;doc.visibility='public';doc.tags=['puzzle'];doc.presentation=listing().presentation;writeFileSync(join(root,'block.json'),JSON.stringify(doc));const dep=JSON.parse(readFileSync(join(root,'block-dependencies.json')));dep.files.push('screen.png');writeFileSync(join(root,'block-dependencies.json'),JSON.stringify(dep));const png=new PNG({width:13,height:17});png.data.fill(255);const raw=PNG.sync.write(png);writeFileSync(join(root,'screen.png'),raw);fn(root,doc,dep,raw);}finally{rmSync(root,{recursive:true,force:true});}}
test('fully decoded natural PNG and exact source projection pass',()=>fixture((root,doc,dep,raw)=>{const b={...base,schemaVersion:2,id:doc.id,version:doc.version,permissions:doc.capabilities,tags:doc.tags,presentation:doc.presentation,presentationEvidence:{screenshot:{sha256:createHash('sha256').update(raw).digest('hex'),width:13,height:17,mediaType:'image/png'}}};validateBlock(root,b);b.presentationEvidence.screenshot.width++;assert.throws(()=>validateBlock(root,b),/evidence/);}));
test('screenshot cannot be excluded or linked',()=>fixture((root,doc,dep)=>{dep.files=dep.files.filter(v=>v!=='screen.png');writeFileSync(join(root,'block-dependencies.json'),JSON.stringify(dep));assert.throws(()=>validateBlock(root),/distribution/);rmSync(join(root,'screen.png'));symlinkSync('/etc/passwd',join(root,'screen.png'));assert.throws(()=>validateBlock(root),/symlink/);}));
test('truncated image cannot pass with a valid-looking header',()=>fixture((root,doc,dep,raw)=>{writeFileSync(join(root,'screen.png'),raw.subarray(0,25));assert.throws(()=>validateBlock(root));}));
