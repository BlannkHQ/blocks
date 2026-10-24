import {readFileSync,readdirSync,lstatSync,realpathSync,existsSync} from 'node:fs';
import {resolve,relative,join,dirname,isAbsolute,sep} from 'node:path';
import {createHash} from 'node:crypto';
import Ajv from 'ajv';
import {PNG} from 'pngjs';
const ajv=new Ajv({allErrors:true});
const validators=Object.fromEntries(['runtime','dependencies'].map(kind=>[kind,ajv.compile(JSON.parse(readFileSync(new URL(`../schema/${kind}.schema.json`,import.meta.url),'utf8')))]));
function schema(kind,value){if(!validators[kind](value))throw new Error(`${kind}: ${ajv.errorsText(validators[kind].errors)}`);}
function inside(root,value){
 if(typeof value!=='string'||isAbsolute(value)||value.split(/[\\/]/).includes('..'))throw new Error(`Escaping runtime path: ${value}`);
 const target=resolve(root,value),part=relative(root,target);
 if(part.startsWith('..'+sep)||isAbsolute(part))throw new Error(`Escaping runtime path: ${value}`);
 let current=root;
 for(const item of part.split(sep).filter(Boolean)){current=join(current,item);if(lstatSync(current).isSymbolicLink())throw new Error(`Package symlink: ${value}`);}
 return target;
}
function files(root){return readdirSync(root).sort((a,b)=>Buffer.compare(Buffer.from(a),Buffer.from(b))).flatMap(name=>{const path=join(root,name),stat=lstatSync(path);if(stat.isSymbolicLink())throw new Error(`Package symlink: ${path}`);if(stat.isDirectory())return files(path);if(!stat.isFile())throw new Error(`Special package file: ${path}`);return [path];});}
export function dependencyDigest(path){
 if(lstatSync(path).isFile())return createHash('sha256').update(readFileSync(path)).digest('hex');
 const hash=createHash('sha256');for(const file of files(path))hash.update(relative(path,file).split(sep).join('/')).update(Buffer.from([0])).update(createHash('sha256').update(readFileSync(file)).digest());return hash.digest('hex');
}
export function validateBlock(directory,listing){
 if(lstatSync(directory).isSymbolicLink())throw new Error('Block root cannot be a symlink');
 const root=realpathSync(directory),manifest=JSON.parse(readFileSync(inside(root,'block.json'),'utf8'));schema('runtime',manifest);
 const runtime=manifest.runtime;
 const required=['block.json',runtime.entry,...(runtime.kind==='hybrid'?[runtime.body]:[]),...(manifest.helpers||[]).map(helper=>helper.entry)];
 for(const path of required)if(!lstatSync(inside(root,path)).isFile())throw new Error(`Required runtime file missing: ${path}`);
 if((manifest.defaults?.placements||[]).length&&!manifest.surfaces.includes('island'))throw new Error('Island placement requires an Island surface');
 let screenshotEvidence=null;
 if(manifest.presentation?.screenshot){
  const data=readFileSync(inside(root,manifest.presentation.screenshot.path));
  if(data.length>2*1024*1024||data.length<24||data.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw new Error('Screenshot must be a PNG at most 2 MiB');
  const width=data.readUInt32BE(16),height=data.readUInt32BE(20);
  if(!width||!height||width>4096||height>4096||width*height>8000000)throw new Error('Screenshot dimensions exceed bounds');
  for(let at=8;at<data.length;){if(at+12>data.length)throw new Error('Truncated PNG');const size=data.readUInt32BE(at),kind=data.subarray(at+4,at+8).toString();if(kind==='acTL')throw new Error('Screenshot must be still');at+=12+size;if(at>data.length)throw new Error('Truncated PNG');}
  const decoded=PNG.sync.read(data,{checkCRC:true});if(decoded.width!==width||decoded.height!==height)throw new Error('Screenshot dimensions changed');
  screenshotEvidence={sha256:createHash('sha256').update(data).digest('hex'),width,height,mediaType:'image/png'};
  required.push(manifest.presentation.screenshot.path);
 }
 const all=files(root).map(file=>relative(root,file).split(sep).join('/'));
 let dependencies=null,excluded=[];
 if(existsSync(join(root,'block-dependencies.json'))){
  dependencies=JSON.parse(readFileSync(inside(root,'block-dependencies.json'),'utf8'));schema('dependencies',dependencies);
  const selected=path=>dependencies.files.some(value=>value==='.'||path===value||path.startsWith(value+'/'));
  for(const path of dependencies.files)inside(root,path);
  for(const path of [...required,'block-dependencies.json',...dependencies.qmlImportPaths,...dependencies.pythonPaths,...dependencies.libraryPaths,...dependencies.dynamicAssets]){
   inside(root,path);if(!selected(path))throw new Error(`Add required path to distribution files: ${path}`);
  }
  for(const item of dependencies.bundled){if(!selected(item.path))throw new Error(`Bundled dependency excluded: ${item.path}`);if(dependencyDigest(inside(root,item.path))!==item.sha256)throw new Error(`Bundled dependency checksum changed: ${item.path}`);}
  for(const module of dependencies.qmlModules.filter(item=>item.provider==='bundled')){
   if(!dependencies.qmlImportPaths.some(path=>existsSync(join(inside(root,path),...module.uri.split('.'),'qmldir'))))throw new Error(`Missing bundled QML module: ${module.uri}`);
  }
  for(const path of all.filter(path=>path.endsWith('.qml')&&selected(path))){
   const source=readFileSync(join(root,path),'utf8');
   for(const match of source.matchAll(/\bimport\s+"([^"\n]+)"/g)){
    const imported=relative(root,resolve(dirname(join(root,path)),match[1])).split(sep).join('/');inside(root,imported);if(!selected(imported))throw new Error(`Local QML import excluded: ${imported}`);
   }
  }
  excluded=all.filter(path=>!selected(path));
 }
 if(listing){
  if(manifest.schemaVersion===2){if(JSON.stringify(listing.tags)!==JSON.stringify(manifest.tags))throw new Error('Listing/source tags mismatch');if(JSON.stringify(listing.presentation||null)!==JSON.stringify(manifest.presentation||null))throw new Error('Listing/source presentation mismatch');const actual=listing.presentationEvidence?.screenshot;if(Boolean(actual)!==Boolean(screenshotEvidence)||actual&&Object.keys(screenshotEvidence).some(k=>actual[k]!==screenshotEvidence[k]))throw new Error('Listing screenshot evidence mismatch');}
  if(manifest.componentType==='service')throw new Error('Public catalog entries must be optional Blocks');
  for(const key of ['id','version'])if(listing[key]!==manifest[key])throw new Error(`Listing/runtime ${key} mismatch`);
  if(manifest.visibility!=='public')throw new Error('Public submission requires explicit public artifact intent; private source is not published');
  if(JSON.stringify([...listing.permissions].sort())!==JSON.stringify([...(manifest.capabilities||[])].sort()))throw new Error('Listing permissions must exactly match runtime capabilities');
 }
 return {id:manifest.id,version:manifest.version,visibility:manifest.visibility,distribution:dependencies?'explicit':'legacy-full-package',excludedFiles:excluded,hostModules:dependencies?.qmlModules.filter(item=>item.provider==='host')||[],runtimeExecuted:false};
}
