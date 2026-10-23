//@ pragma AppId user.local.example-custom-graph
import QtQuick
import QtQuick.Layouts
import Quickshell
import Quickshell.Io
import Blannk.Design 1.0 as Design
ShellRoot {
 id:root
 property bool opened:false
 property string viewName:"chart"
 IpcHandler {
  target:"block"
  function openPanel():void{root.opened=true}
  function hide():void{root.opened=false}
  function state():string{return JSON.stringify({open:root.opened,graphLoaded:view.status===Loader.Ready})}
 }
 FloatingWindow {
  visible:root.opened
  title:"BLANNK / CUSTOM GRAPH"
  implicitWidth:760;implicitHeight:500
  color:Design.Tokens.panel
  Design.PanelFrame {
   header:Design.PanelHeader {Layout.fillWidth:true;title:"CUSTOM GRAPH"}
   Loader {id:view;Layout.fillWidth:true;Layout.fillHeight:true;source:"views/"+root.viewName+".qml"}
   footer:Design.CommandFooter {Layout.fillWidth:true;commands:[{key:"Esc",action:"Close",trigger:()=>root.opened=false}]}
  }
 }
}
