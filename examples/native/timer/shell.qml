//@ pragma AppId user.local.example-timer
import QtQuick
import QtQuick.Layouts
import Quickshell
import Quickshell.Io
import Blannk.Design 1.0 as Design
ShellRoot{id:root;property bool opened:false;property int seconds:300;property bool ticking:false;property int score:0
 Timer{interval:1000;repeat:true;running:root.ticking&&root.seconds>0;onTriggered:{root.seconds--;if(!root.seconds)root.ticking=false;}}
 IpcHandler{target:"block";function openPanel():void{root.opened=true}function hide():void{root.opened=false}function state():string{return JSON.stringify({open:root.opened})}}
 FloatingWindow{visible:root.opened;title:"BLANNK / TIMER";implicitWidth:760;implicitHeight:620;color:Design.Tokens.panel;onVisibleChanged:if(!visible)root.opened=false
 Shortcut{sequence:"Escape";onActivated:root.opened=false}
 Design.PanelFrame{header:Design.PanelHeader{Layout.fillWidth:true;title:"TIMER"}
 Item{Layout.fillWidth:true;Layout.fillHeight:true;Column{anchors.centerIn:parent;spacing:16;Design.Label{text:Math.floor(root.seconds/60)+":"+String(root.seconds%60).padStart(2,"0")}Row{spacing:8;Design.Button{text:root.ticking?"Pause":"Start";onClicked:root.ticking=!root.ticking}Design.Button{text:"Reset";onClicked:{root.ticking=false;root.seconds=300;}}}}}
 footer:Design.CommandFooter{Layout.fillWidth:true;commands:[{key:"Esc",action:"Close",trigger:()=>root.opened=false}]}
 }}}
