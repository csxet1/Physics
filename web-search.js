/* ===== بحث الويب — Google Web Search عبر API وسيط ===== */
(function(root){
'use strict';
var C=root.AX_CONFIG||{};
var WS=C.webSearch||{};
function clean(s){return String(s||'').replace(/\s+/g,' ').trim().slice(0,500)}
function tidy(s,n){
  s=String(s||'')
    .replace(/https?:\/\/\S+/g,' ')
    .replace(/[#*_`~|]{2,}/g,' ')
    .replace(/^#+\s*/gm,' ')
    .replace(/\\n|\\t/g,' ')
    .replace(/\$/g,' ')
    .replace(/[´»«¨¯¸]/g,' ')
    .replace(/[\u0000-\u001f\u007f-\u009f\ufffd]/g,' ')
    .replace(/\s+/g,' ').trim();
  if(s.length>n){s=s.slice(0,n);var i=Math.max(s.lastIndexOf('. '),s.lastIndexOf(' '));if(i>n*0.6)s=s.slice(0,i);s+='…'}
  return s;
}
function esc(s){return String(s).replace(/[&<>\"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
async function search(q,opts){
  opts=opts||{}; q=clean(q); if(!q)throw new Error('سؤال البحث فارغ');
  var endpoint=clean(WS.endpoint);
  if(!endpoint)throw new Error('لم يتم ضبط رابط خدمة بحث الويب');
  var u=new URL(endpoint,location.href); u.searchParams.set('q',q); if(opts.subject)u.searchParams.set('subject',opts.subject);
  var r=await fetch(u.toString(),{method:'GET',headers:{'Accept':'application/json'},cache:'no-store'});
  var data=null; try{data=await r.json()}catch(e){data=null}
  if(!r.ok)throw new Error((data&&data.error)||('فشل بحث الويب ('+r.status+')'));
  if(!data||!Array.isArray(data.items))return {query:q,items:[],total:0};
  return {query:data.query||q,items:data.items.slice(0,8).map(function(x){return {
    title:tidy(x.title,160),
    link:String(x.link||''),
    snippet:tidy(x.snippet,320),
    displayLink:clean(x.displayLink||'')
  }}).filter(function(x){return x.title&&x.link}),total:data.total||data.items.length};
}
function cards(data){
  var a=data.items||[];
  if(!a.length)return '<div class="axcard"><b>بحث الويب</b><p>ما ظهرت نتائج مناسبة من الويب.</p></div>';
  var h='<div class="axcard axweb"><div class="axwebhead"><b>🌐 بحث الويب</b><small>'+esc(data.query||'')+'</small></div>';
  h+=a.slice(0,6).map(function(x,i){return '<a class="axwebitem" href="'+esc(x.link)+'" target="_blank" rel="noopener noreferrer"><span class="axwebn">'+(i+1)+'</span><span><b>'+esc(x.title)+'</b><small>'+esc(x.displayLink)+'</small><em>'+esc(x.snippet)+'</em></span></a>'}).join('');
  return h+'</div>';
}
root.AXWEB={search:search,cards:cards,enabled:function(){return !!clean(WS.endpoint)}};
})(typeof window!=='undefined'?window:globalThis);
