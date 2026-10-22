/* قص صورة السؤال: الطالب يسحب بإصبعه حول السؤال فقط (يحسّن دقة OCR) */
(function(w){
'use strict';
var AXS=w.AXS=w.AXS||{};
/* يرجع: ملف مقصوص | الصورة الأصلية (كاملة) | null (إلغاء) */
AXS.crop=function(file){return new Promise(function(res){
 var u=URL.createObjectURL(file),im=new Image();
 im.onerror=function(){URL.revokeObjectURL(u);res(file)};
 im.onload=function(){
  var ov=document.createElement('div');ov.id='ax-cr';
  ov.innerHTML='<div class="crh">اسحب بإصبعك حول السؤال فقط</div><canvas></canvas><div class="crb"><button type="button" data-a="ok">قص واستخدم</button><button type="button" data-a="all">الصورة كاملة</button><button type="button" data-a="x">إلغاء</button></div>';
  document.body.appendChild(ov);
  var cv=ov.querySelector('canvas'),cx=cv.getContext('2d'),
      W=Math.min(w.innerWidth-24,640),H=Math.max(200,w.innerHeight-190),s=Math.min(W/im.width,H/im.height,1),r=null,st=null;
  cv.width=Math.round(im.width*s);cv.height=Math.round(im.height*s);
  function draw(){cx.clearRect(0,0,cv.width,cv.height);cx.drawImage(im,0,0,cv.width,cv.height);
   if(r){cx.fillStyle='rgba(0,0,0,.58)';cx.beginPath();cx.rect(0,0,cv.width,cv.height);cx.rect(r.x,r.y,r.w,r.h);cx.fill('evenodd');
    cx.strokeStyle='#a98bff';cx.lineWidth=2;cx.strokeRect(r.x,r.y,r.w,r.h)}}
  function pt(e){var b=cv.getBoundingClientRect();return{x:Math.max(0,Math.min(cv.width,(e.clientX-b.left)*cv.width/b.width)),y:Math.max(0,Math.min(cv.height,(e.clientY-b.top)*cv.height/b.height))}}
  cv.addEventListener('pointerdown',function(e){st=pt(e);r={x:st.x,y:st.y,w:0,h:0};try{cv.setPointerCapture(e.pointerId)}catch(x){}draw()});
  cv.addEventListener('pointermove',function(e){if(!st)return;var p=pt(e);r={x:Math.min(st.x,p.x),y:Math.min(st.y,p.y),w:Math.abs(p.x-st.x),h:Math.abs(p.y-st.y)};draw()});
  function up(){st=null}cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  function close(v){ov.remove();URL.revokeObjectURL(u);res(v)}
  ov.addEventListener('click',function(e){var a=e.target.dataset&&e.target.dataset.a;if(!a)return;
   if(a==='x')return close(null);
   if(a==='all'||!r||r.w<30||r.h<30)return close(file);
   var k=im.width/cv.width,c=document.createElement('canvas');c.width=Math.round(r.w*k);c.height=Math.round(r.h*k);
   c.getContext('2d').drawImage(im,r.x*k,r.y*k,r.w*k,r.h*k,0,0,c.width,c.height);
   c.toBlob(function(b){close(b?new File([b],'السؤال.png',{type:'image/png'}):file)},'image/png')});
  draw()};
 im.src=u})};
})(window);
