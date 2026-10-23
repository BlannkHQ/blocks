#!/usr/bin/env python3
"""Opt-in local OS validation/native preview. CI never runs submitted Block code."""
import argparse,json,sys,tempfile,time
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--os-checkout',type=Path,required=True);parser.add_argument('--native',action='store_true');args=parser.parse_args();os_root=args.os_checkout.resolve();sys.path.insert(0,str(os_root/'scripts'))
from block_runtime import load
from block_dependencies import inspect,host_module,runtime_environment
examples=sorted(path for path in (ROOT/'examples/native').iterdir() if path.is_dir())
for path in examples:load(path/'block.json');inspect(path)
if not args.native:print(json.dumps(dict(osValidators=True,examples=len(examples),nativeExecuted=False)));raise SystemExit(0)
from blannk_harness import Processes,private_env,headless_sway,wait_for,qs_json,qs_call,reexec_in_dbus
reexec_in_dbus()
with tempfile.TemporaryDirectory(prefix='blocks-contract-native-') as temporary:
 work=Path(temporary);host_module(os_root/'shared/design',work/'imports');env=private_env(work,QML_IMPORT_PATH=str(work/'imports'));logfile=work/'native.log'
 with logfile.open('w') as log,Processes(log) as processes:
  headless_sway(processes,env,work,ipc=True);results=[]
  for folder in examples:
   entry=folder/'shell.qml';process=processes.start(['qs','-p',entry],runtime_environment(folder,env));state=lambda:qs_json(entry,env,'block','state')
   wait_for(lambda:state() is not None,'Example IPC initializes');qs_call(entry,env,'block','openPanel');wait_for(lambda:state()['open'],'Example opens')
   if folder.name=='custom-graph':wait_for(lambda:state().get('graphLoaded'),'Custom dynamic module loads')
   time.sleep(.15);qs_call(entry,env,'block','hide');wait_for(lambda:not state()['open'],'Example hides');process.terminate();process.wait(timeout=5);results.append(folder.name)
  log.flush();text=logfile.read_text()
  for error in ('ReferenceError:','TypeError:','is not a function','is not installed'):assert error not in text,text[-4000:]
  print(json.dumps(dict(osValidators=True,nativeExecuted=True,examples=results,hostSharedModule=True,customDynamicModule=True,examplesModified=False)))
