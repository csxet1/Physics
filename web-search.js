/* ===== بحث الويب والإجابة الذكية — Cloudflare Worker ===== */
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
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function endpointUrl(endpoint,q,opts){
  var u=new URL(endpoint,location.href);
  u.searchParams.set('q',q);
  if(opts&&opts.subject)u.searchParams.set('subject',opts.subject);
  return u;
}
async function requestJSON(url){
  var r=await fetch(url.toString(),{method:'GET',headers:{'Accept':'application/json'},cache:'no-store'});
  var data=null;
  try{data=await r.json()}catch(e){data=null}
  if(!r.ok)throw new Error((data&&data.error)||('فشل الطلب ('+r.status+')'));
  if(!data||typeof data!=='object')throw new Error('استجابة غير صالحة من خدمة الويب');
  return data;
}
async function search(q,opts){
  opts=opts||{};q=clean(q);if(!q)throw new Error('سؤال البحث فارغ');
  var endpoint=clean(WS.endpoint);
  if(!endpoint)throw new Error('لم يتم ضبط رابط خدمة بحث الويب');
  var data=await requestJSON(endpointUrl(endpoint,q,opts));
  if(!Array.isArray(data.items))return {query:q,items:[],total:0};
  return {query:data.query||q,items:data.items.slice(0,8).map(function(x){return {
    title:tidy(x.title,160),
    link:String(x.link||''),
    snippet:tidy(x.snippet,320),
    displayLink:clean(x.displayLink||'')
  }}).filter(function(x){return x.title&&x.link}),total:data.total||data.items.length};
}
function plainAnswer(s){
  s=String(s||'').replace(/\r/g,'');
  /* Normalize doubled slashes and escaped newlines sometimes returned by the model. */
  s=s.replace(/\\\\/g,'\\');
  s=s.replace(/\\r\\n|\\n|\\r/g,'\n');
  /* Convert common LaTeX notation to readable plain text for mobile browsers. */
  s=s.replace(/\\\\?\[|\\\\?\]/g,'')
    .replace(/\\\\?\(|\\\\?\)/g,'')
    .replace(/\\text\{([^{}]*)\}/g,'$1')
    .replace(/\\mathbf\{([^{}]*)\}/g,'$1')
    .replace(/\\mathrm\{([^{}]*)\}/g,'$1')
    .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g,'($1)/($2)')
    .replace(/\\sum/g,'Σ').replace(/\\cdot/g,'·').replace(/\\times/g,'×')
    .replace(/\\rightarrow/g,'→').replace(/\\approx/g,'≈')
    .replace(/\\Delta/g,'Δ').replace(/\\alpha/g,'α').replace(/\\beta/g,'β')
    .replace(/\\;/g,' ').replace(/\\,/g,' ').replace(/\\!/g,'')
    .replace(/\\left|\\right/g,'')
    .replace(/\\([A-Za-z]+)/g,'$1')
    .replace(/[{}]/g,'')
    .replace(/[ \t]+\n/g,'\n')
    .replace(/\n{3,}/g,'\n\n')
    .trim();
  return s;
}
function formatAnswer(s){
  var safe=esc(plainAnswer(s));
  /* Limited, safe Markdown bold formatting after HTML escaping. */
  safe=safe.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
  return safe.replace(/\n/g,'<br>');
}
async function answer(q,opts){
  opts=opts||{};q=clean(q);if(!q)throw new Error('سؤال البحث فارغ');
  var endpoint=clean(WS.answerEndpoint);
  if(!endpoint)throw new Error('لم يتم ضبط رابط الإجابة الذكية');
  var data=await requestJSON(endpointUrl(endpoint,q,opts));
  if(typeof data.answer!=='string'||!data.answer.trim())throw new Error('خدمة الإجابة الذكية لم تُرجع إجابة');
  return {query:q,answer:plainAnswer(data.answer),sources:Array.isArray(data.sources)?data.sources.slice(0,8):[],model:data.model||'',status:data.groqStatus||''};
}
function answerCard(data){
  var h='<div class="axcard axweb axai-answer"><div class="axwebhead"><b>✦ الإجابة الذكية</b><small>'+esc(data.query||'')+'</small></div>';
  h+='<div class="axai-text">'+formatAnswer(data.answer||'')+'</div>';
  if(data.sources&&data.sources.length){
    h+='<div class="axai-sources"><b>المصادر</b>';
    h+=data.sources.map(function(x,i){
      var n=Number(x.n)||i+1,link=String(x.link||'');
      if(!/^https?:\/\//i.test(link))return '';
      return '<a class="axwebitem" href="'+esc(link)+'" target="_blank" rel="noopener noreferrer"><span class="axwebn">'+n+'</span><span><b>'+esc(x.title||'المصدر '+n)+'</b><small>'+esc(link.replace(/^https?:\/\//,''))+'</small></span></a>';
    }).join('');
    h+='</div>';
  }
  h+='<div class="axnote">الإجابة مبنية على نتائج البحث؛ افتح المصادر للتحقق من التفاصيل.</div></div>';
  return h;
}
function cards(data){
  var a=data.items||[];
  if(!a.length)return '<div class="axcard"><b>بحث الويب</b><p>ما ظهرت نتائج مناسبة من الويب.</p></div>';
  var h='<div class="axcard axweb"><div class="axwebhead"><b>🌐 نتائج بحث الويب</b><small>'+esc(data.query||'')+'</small></div>';
  h+=a.slice(0,6).map(function(x,i){return '<a class="axwebitem" href="'+esc(x.link)+'" target="_blank" rel="noopener noreferrer"><span class="axwebn">'+(i+1)+'</span><span><b>'+esc(x.title)+'</b><small>'+esc(x.displayLink)+'</small><em>'+esc(x.snippet)+'</em></span></a>'}).join('');
  return h+'</div>';
}
root.AXWEB={
  search:search,
  answer:answer,
  cards:cards,
  answerCard:answerCard,
  enabled:function(){return !!clean(WS.endpoint)},
  answerEnabled:function(){return !!clean(WS.answerEndpoint)}
};
})(typeof window!=='undefined'?window:globalThis);
