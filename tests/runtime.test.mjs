import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,cpSync,readFileSync,writeFileSync,rmSync,mkdirSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateBlock,dependencyDigest} from '../scripts/runtime.mjs';
const examples=fileURLToPath(new URL('../examples/native/',import.meta.url));
function fixture(run,name='blank-canvas'){const root=mkdtempSync(join(tmpdir(),'block-contract-'));try{cpSync(join(examples,name),root,{recursive:true});run(root);}finally{rmSync(root,{recursive:true,force:true});}}
function edit(root,name,patch){const path=join(root,name),value=JSON.parse(readFileSync(path));Object.assign(value,patch);writeFileSync(path,JSON.stringify(value));}
const listing={id:'user.local.example-blank-canvas',version:'0.1.0',permissions:['own-data']};
test('native starter uses the host module without copying shared controls',()=>fixture(root=>{assert.equal(validateBlock(root).distribution,'explicit');assert.equal(existsSync(join(root,'design')),false);}));
test('public listing preserves ID and matches source version/capabilities',()=>fixture(root=>{edit(root,'block.json',{visibility:'public'});assert.equal(validateBlock(root,listing).id,listing.id);assert.throws(()=>validateBlock(root,{...listing,version:'1.0.0'}),/version mismatch/);assert.throws(()=>validateBlock(root,{...listing,permissions:['network']}),/permissions/);}));
test('private source is never silently converted into a public submission',()=>fixture(root=>assert.throws(()=>validateBlock(root,listing),/explicit public artifact/)));
test('required runtime files cannot be excluded',()=>fixture(root=>{edit(root,'block-dependencies.json',{files:['block.json','block-dependencies.json']});assert.throws(()=>validateBlock(root),/required path/);}));
test('unfamiliar source is reported, never deleted',()=>fixture(root=>{writeFileSync(join(root,'custom.shader'),'custom');assert.ok(validateBlock(root).excludedFiles.includes('custom.shader'));assert.equal(readFileSync(join(root,'custom.shader'),'utf8'),'custom');}));
test('custom module, dynamic views and custom graphics are valid',()=>fixture(root=>assert.equal(validateBlock(root).visibility,'private'),'custom-graph'));
test('bundled content checksums detect a changed dependency',()=>fixture(root=>{mkdirSync(join(root,'vendor'));writeFileSync(join(root,'vendor/graph.js'),'original');const path=join(root,'block-dependencies.json'),value=JSON.parse(readFileSync(path));value.files.push('vendor');value.bundled=[{path:'vendor',source:'https://example.test/graphs',revision:'immutable-fixture-revision',license:'MIT',sha256:dependencyDigest(join(root,'vendor'))}];writeFileSync(path,JSON.stringify(value));validateBlock(root);writeFileSync(join(root,'vendor/graph.js'),'changed');assert.throws(()=>validateBlock(root),/checksum changed/);}));
test('OS capability names work while arbitrary privileged requests do not',()=>fixture(root=>{edit(root,'block.json',{capabilities:['system-info','audio-control']});validateBlock(root);edit(root,'block.json',{capabilities:['root-shell']});assert.throws(()=>validateBlock(root),/runtime/);}));
test('hybrid body and declared surfaces are checked',()=>fixture(root=>{const manifest=JSON.parse(readFileSync(join(root,'block.json')));manifest.runtime.kind='hybrid';writeFileSync(join(root,'block.json'),JSON.stringify(manifest));assert.throws(()=>validateBlock(root));}));
test('intentional custom visuals are allowed',()=>fixture(root=>{writeFileSync(join(root,'shell.qml'),'import QtQuick\nimport Quickshell\nShellRoot { FloatingWindow { color:"purple" } }');edit(root,'block-dependencies.json',{qmlModules:[]});validateBlock(root);}));
