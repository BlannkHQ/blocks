#!/usr/bin/env python3
"""Refresh reviewable contract snapshots from an explicitly selected trusted OS checkout."""
import argparse,hashlib,json,subprocess,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def snapshots(os_root):
 sys.path.insert(0,str(os_root/'scripts'))
 from block_runtime import CAPABILITIES
 from block_templates import starter
 source_paths=['scripts/block_runtime.py','scripts/block_templates.py','scripts/block_dependencies.py','scripts/block_install.py']
 commit=subprocess.check_output(['git','-C',str(os_root),'rev-parse','HEAD'],text=True).strip()
 path=dict(type='string',minLength=1,pattern=r'^(?!/)(?!.*(?:^|/)\.\.(?:/|$)).+$')
 dependency_path=dict(type='string',minLength=1,maxLength=4096,pattern=r'^(?!/)(?!.*\\)(?!.*(?:^|/)\.\.(?:/|$))[^/]+(?:/[^/]+)*$')
 strings=lambda **extra:dict(type='array',items=dict(type='string'),uniqueItems=True,**extra)
 ipc=dict(type='object',additionalProperties=False,required=['target','open','state','hide'],properties={key:dict(type='string',pattern='^[A-Za-z][A-Za-z0-9]*$') for key in ['target','open','state','hide']})
 runtime=dict(type='object',additionalProperties=False,required=['kind','entry','appId'],properties=dict(kind=dict(enum=['qml','hybrid','tui']),entry=path,body=path,appId=dict(type='string',pattern='^[a-z0-9.-]+$'),context=dict(enum=['none','active-window']),ipc=ipc))
 runtime['allOf']=[{'if':{'properties':{'kind':{'const':'hybrid'}}},'then':{'required':['body']}},{'if':{'properties':{'kind':{'enum':['qml','hybrid']}}},'then':{'required':['ipc']}}]
 manifest=dict(title='BLANNK runtime manifest v1 snapshot',type='object',additionalProperties=False,required=['schemaVersion','id','name','version','visibility','runtime','surfaces'],properties=dict(schemaVersion=dict(const=1),id=dict(type='string',pattern=r'^(?:blannk\.[a-z0-9-]+|user\.[a-z0-9-]+\.[a-z0-9-]+)$'),name=dict(type='string',minLength=1,pattern=r'\S'),version=dict(type='string',pattern=r'^\d+\.\d+\.\d+(?:-[\w.-]+)?$'),visibility=dict(enum=['public','private']),runtime=runtime,surfaces=strings(),capabilities=dict(type='array',uniqueItems=True,items=dict(enum=sorted(CAPABILITIES))),dependencies=strings(),componentType=dict(enum=['block','service']),helpers=dict(type='array',items=dict(type='object',additionalProperties=False,required=['id','entry','interpreter'],properties=dict(id=dict(type='string',pattern='^[a-z][a-z0-9-]*$'),entry=path,interpreter=dict(enum=['python3','sh'])))),defaults=dict(type='object',additionalProperties=False,properties=dict(enabled=dict(type='boolean'),placements=dict(type='array',items=dict(type='object',additionalProperties=False,required=['surface'],properties=dict(surface=dict(const='island'),region=dict(type='string'))))))))
 manifest['properties']['surfaces']['items']={'enum':['launcher','island','standalone']}
 module=dict(type='object',additionalProperties=False,required=['uri','version','provider'],properties=dict(uri=dict(type='string',pattern=r'^[A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*$'),version=dict(type='string',pattern=r'^\d+\.\d+$'),provider=dict(enum=['host','bundled'])))
 bundled=dict(type='object',additionalProperties=False,required=['path','source','revision','license','sha256'],properties={key:dict(type='string',minLength=1,pattern=r'\S') for key in ['path','source','revision','license','sha256']});bundled['properties']['path']=dependency_path;bundled['properties']['sha256']['pattern']='^[a-f0-9]{64}$'
 deps=dict(title='BLANNK explicit distribution/dependencies v1 snapshot',type='object',additionalProperties=False,required=['schemaVersion','files','qmlModules','qmlImportPaths','pythonPaths','libraryPaths','bundled','dynamicAssets'],properties=dict(schemaVersion=dict(const=1),files=dict(type='array',minItems=1,uniqueItems=True,items=dependency_path),qmlModules=dict(type='array',items=module),bundled=dict(type='array',items=bundled)))
 for key in ['qmlImportPaths','pythonPaths','libraryPaths','dynamicAssets']:deps['properties'][key]=dict(type='array',items=dependency_path)
 listing=json.loads((ROOT/'schema/listing.schema.json').read_text());manifest['properties'].update(tags=listing['properties']['tags'],presentation=listing['properties']['presentation']);manifest['properties']['schemaVersion']={'enum':[1,2]};manifest['title']='BLANNK runtime manifest v1/v2';manifest['allOf'].append({'if':{'properties':{'schemaVersion':{'const':1}}},'then':{'properties':{'tags':False,'presentation':False}}})
 output={}
 for name,value in [('runtime.schema.json',manifest),('dependencies.schema.json',deps)]:
  value={'$schema':'http://json-schema.org/draft-07/schema#',**value};output['schema/'+name]=json.dumps(value,indent=2)+'\n'
 output['contracts/os-contract.json']=json.dumps(dict(schemaVersion=1,source=dict(repository='https://github.com/BlannkHQ/BLANNK_OS_CANVAS',commit=commit,files={name:hashlib.sha256((os_root/name).read_bytes()).hexdigest() for name in source_paths}),runtimeSchemaVersion=1,hostDesign=dict(uri='Blannk.Design',version='1.0',providedBy='BLANNK OS'),capabilities=sorted(CAPABILITIES),notes='Metadata snapshots are review aids. The pinned OS validators and native runtime remain authoritative.'),indent=2)+'\n'
 for template in ['Blank canvas','Timer','Dashboard','Small game']:
  slug=template.lower().replace(' ','-')
  for name,text in starter(template,template,identity='user.local.example-'+slug).items():output['examples/native/'+slug+'/'+name]=text
 return output
if __name__=='__main__':
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--os-checkout',type=Path,required=True);parser.add_argument('--check',action='store_true');args=parser.parse_args();output=snapshots(args.os_checkout.resolve());changed=[]
 for name,text in output.items():
  path=ROOT/name
  if args.check:
   if not path.is_file() or path.read_text()!=text:changed.append(name)
  else:path.parent.mkdir(parents=True,exist_ok=True);path.write_text(text)
 if changed:raise SystemExit('Contract drift requires review: '+', '.join(changed))
 print('Checked' if args.check else 'Refreshed',len(output),'contract/template files against the selected OS revision.')
