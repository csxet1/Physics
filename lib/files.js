/* قراءة PDF (pdf.js) وصور الأسئلة (Tesseract OCR) — تُحمَّل عند الحاجة فقط */
(function(w){
'use strict';
var AXS=w.AXS=w.AXS||{};
var PDFJS='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    PDFW='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
    TESS='https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
var loaded={};
function loadScript(src){return loaded[src]||(loaded[src]=new Promise(function(res,rej){var s=document.createElement('script');s.src=src;s.onload=res;s.onerror=function(){delete loaded[src];rej(new Error('تعذر تحميل مكتبة من الإنترنت'))};document.head.appendChild(s)}))}
/* تقطيع نص صفحة الى مقاطع ~450 حرف */
AXS.chunk=function(t){var out=[],cur='';t.split(/\n+/).forEach(function(l){l=l.trim();if(!l)return;if((cur+' '+l).length>450&&cur){out.push(cur);cur=l}else cur=cur?cur+' '+l:l});if(cur.length>20)out.push(cur);return out};
AXS.extractPdf=async function(file,onProg,o){o=o||{};
 await loadScript(PDFJS);pdfjsLib.GlobalWorkerOptions.workerSrc=PDFW;
 var pdf=await pdfjsLib.getDocument({data:await file.arrayBuffer()}).promise,out=[],name=file.name.replace(/\.pdf$/i,''),scanned=0;
 for(var i=1;i<=pdf.numPages;i++){
  var pg=await pdf.getPage(i),tc=await pg.getTextContent(),t='';
  tc.items.forEach(function(it){t+=it.str+(it.hasEOL?'\n':' ')});
  t=t.normalize('NFKC');
  if(t.replace(/\s/g,'').length<25){scanned++;
   if(o.ocr){var vp=pg.getViewport({scale:2}),c=document.createElement('canvas');c.width=vp.width;c.height=vp.height;
    await pg.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;t=await AXS.ocr(c)}}
  AXS.chunk(t).forEach(function(x){out.push({f:name,p:i,t:x})});
  if(onProg)onProg(i,pdf.numPages,out.length)}
 out.scanned=scanned;return out};
/* ---------- OCR ---------- */
var worker=null,cb=null;
function prep(src){return new Promise(function(res,rej){
 if(src.getContext)return res(src);
 var u=URL.createObjectURL(src),im=new Image();
 im.onload=function(){var m=Math.max(im.width,im.height),s=Math.max(.5,Math.min(2.5,1800/m)),
  c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);
  var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);
  var d=x.getImageData(0,0,c.width,c.height),p=d.data,h=new Array(256).fill(0),i,g;
  for(i=0;i<p.length;i+=4){g=(p[i]*.299+p[i+1]*.587+p[i+2]*.114)|0;p[i]=p[i+1]=p[i+2]=g;h[g]++}
  var tot=p.length/4,a=0,lo=0,hi=255;for(i=0;i<256;i++){a+=h[i];if(a>tot*.02){lo=i;break}}a=0;for(i=255;i>=0;i--){a+=h[i];if(a>tot*.02){hi=i;break}}
  var r=Math.max(40,hi-lo);for(i=0;i<p.length;i+=4){g=Math.max(0,Math.min(255,(p[i]-lo)*255/r));p[i]=p[i+1]=p[i+2]=g}
  x.putImageData(d,0,0);URL.revokeObjectURL(u);res(c)};
 im.onerror=function(){URL.revokeObjectURL(u);rej(new Error('ملف الصورة تالف'))};im.src=u})}
AXS.ocr=async function(src,onProg){
 cb=onProg||null;await loadScript(TESS);
 if(!worker){worker=await Tesseract.createWorker('ara',1,{logger:function(m){if(cb)cb(m)}});
  try{await worker.setParameters({tessedit_pageseg_mode:'6',preserve_interword_spaces:'1'})}catch(e){}}
 var img=await prep(src);
 var r=await Promise.race([worker.recognize(img),new Promise(function(_,no){setTimeout(function(){no(new Error('انتهت المهلة (الصورة ثقيلة أو الانترنت بطيء)'))},90000)})]);
 return {text:r.data.text||'',conf:r.data.confidence||0}};
})(window);
