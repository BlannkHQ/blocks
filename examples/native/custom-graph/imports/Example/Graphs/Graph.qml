// Original demonstration component, not a copied OS control or third-party package.
import QtQuick
Item {
 property var samples:[0.2,0.4,0.3,0.7,0.5,0.8,0.6]
 Canvas {
  anchors.fill:parent;anchors.margins:24
  onPaint:{const c=getContext("2d");c.clearRect(0,0,width,height);c.strokeStyle="#61c9b4";c.lineWidth=3;c.beginPath();for(let i=0;i<parent.samples.length;i++){const x=i*width/(parent.samples.length-1),y=height*(1-parent.samples[i]);if(i)c.lineTo(x,y);else c.moveTo(x,y);}c.stroke();}
 }
}
