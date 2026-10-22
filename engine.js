/* محرك البحث والفهم — بدون سيرفر ولا ذكاء اصطناعي خارجي */
(function(root){
'use strict';
const AR_DIG={'٠':0,'١':1,'٢':2,'٣':3,'٤':4,'٥':5,'٦':6,'٧':7,'٨':8,'٩':9};
function norm(s){
  s=String(s||'').toLowerCase();
  s=s.replace(/[٠-٩]/g,d=>AR_DIG[d]);
  s=s.replace(/[\u064B-\u0652\u0640\u0670]/g,'');
  s=s.replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/ؤ/g,'و').replace(/ئ/g,'ي');
  s=s.replace(/[^\u0621-\u064Aa-z0-9.\s'″°]/g,' ');
  return s.replace(/\s+/g,' ').trim();
}
const PRE=['وبال','وال','بال','كال','فال','لل','ال','و'];
const SUF=['ات','ون','ين','ان','ها','هم','ه','ي','ا'];
function stem(w){
  if(/^[a-z0-9.'″°]+$/.test(w)) return w;
  for(const p of PRE){ if(w.startsWith(p)&&w.length-p.length>=3){w=w.slice(p.length);break;} }
  for(const s of SUF){ if(w.endsWith(s)&&w.length-s.length>=3){w=w.slice(0,-s.length);break;} }
  return w;
}
// مرادفات عامية/فصحى → كلمة موحدة
const SYN={
 'شنو':'ما','شو':'ما','ايش':'ما','شلون':'كيف','وين':'اين','ليش':'لماذا','شكد':'كم','هواي':'كثير',
 'اشرحلي':'اشرح','فهمني':'اشرح','بسطلي':'بسط','نطيني':'اعط','دزلي':'اعط','عطيني':'اعط',
 'تجربه':'تجربه','مختبر':'تجربه','عملي':'تجربه','لاب':'تجربه',
 'استطاره':'استطاره','تشتت':'استطاره','تبعثر':'استطاره',
 'انكسار':'انكسار','كسر':'انكسار','انعكاس':'انعكاس','سنل':'snell','سنيل':'snell','رايلي':'rayleigh','ماي':'mie',
 'بارالاكس':'برالاكس','باراللاكس':'برالاكس','اختلاف':'اختلاف','بارسك':'فرسخ','parsec':'فرسخ','pc':'فرسخ',
 'يونك':'يونغ','young':'يونغ','هوك':'هوك','بويسون':'بويسون','poisson':'بويسون','hubble':'هابل','kepler':'كبلر','بود':'bode',
 'ستيفان':'ستيفان','stefan':'ستيفان','كوازار':'كويزر','كويزرات':'كويزر','كوازرات':'كويزر','quasar':'كويزر',
 'حيود':'حيود','الياف':'الياف','fiber':'الياف','fibre':'الياف','prism':'منشور','موشور':'منشور',
 'spherometer':'اسفيرومتر','سفيرومتر':'اسفيرومتر','اسفيروميتر':'اسفيرومتر',
 'دوبلر':'دوبلر','نجم':'نجم','نجوم':'نجم','شمس':'شمس','قمر':'قمر','مجره':'مجره','مجرات':'مجره'
};
const STOP=new Set(('في من الى على عن ما هو هي هذا هذه ذلك التي الذي ان او ثم قد كل بين مع عند اذا لو كان هل يا انا ني لي لك لنا شي شيء بس هم ها فيه فيها اعط اشرح كم كيف اين لماذا بي').split(' '));
function tokens(q,keepStop){
  const out=[];
  for(let w of norm(q).split(' ')){
    if(!w) continue;
    if(SYN[w]) w=SYN[w];
    if(!keepStop&&STOP.has(w)) continue;
    const s=stem(w); if(s) out.push(s);
  }
  return out;
}
function tri(w){const a=new Set();const t='#'+w+'#';for(let i=0;i<t.length-2;i++)a.add(t.slice(i,i+3));return a;}
function dice(a,b){let n=0;a.forEach(x=>{if(b.has(x))n++;});return 2*n/(a.size+b.size||1);}

/* ------------ الفهرس ------------ */
function buildIndex(kb){
  const units=[],topics=[];
  const add=(t,type,title,text,extra)=>{
    const u=Object.assign({id:units.length,type,topic:t,title,text},extra||{});
    u.tok=tokens(title+' '+text+' '+(t.kw||'')+' '+t.title,true).filter(w=>!STOP.has(w));
    units.push(u);return u;
  };
  kb.forEach(t=>{
    topics.push(t);
    add(t,'sum',t.title,(t.sum||'')+' '+(t.simple||''));
    (t.defs||[]).forEach(d=>add(t,'def',d[0],d[1]));
    (t.laws||[]).forEach(l=>add(t,'law',l.n,(l.eq||'')+' '+(l.note||''),{law:l}));
    (t.qa||[]).forEach(q=>add(t,'qa',q[0],q[1]));
    (t.ex||[]).forEach(e=>add(t,'ex',e.q,e.sol));
    (t.hw||[]).forEach(e=>add(t,'hw',e.q,e.sol||''));
    (t.mem||[]).forEach(m=>add(t,'mem',t.title,m));
  });
  const df={};let tot=0;
  units.forEach(u=>{tot+=u.tok.length;new Set(u.tok).forEach(w=>df[w]=(df[w]||0)+1);});
  const vocab=Object.keys(df);
  return {units,topics,df,N:units.length,avg:tot/units.length||1,vocab,vtri:vocab.map(w=>[w,tri(w)])};
}
function fixTypos(ix,toks){
  ix._tc=ix._tc||{};
  return toks.slice(0,40).map(w=>{
    if(ix.df[w]||w.length<4||!/^[\u0621-\u064A]+$/.test(w)) return w;
    if(w in ix._tc) return ix._tc[w];
    const tw=tri(w);let best=w,bs=0.55;
    for(const [v,t] of ix.vtri){if(Math.abs(v.length-w.length)>3)continue;const d=dice(tw,t);if(d>bs){bs=d;best=v;}}
    ix._tc[w]=best;return best;
  });
}
function bm25(ix,u,qt){
  const k1=1.4,b=0.7;let s=0;
  const tf={};u.tok.forEach(w=>tf[w]=(tf[w]||0)+1);
  const titleT=new Set(tokens(u.title+' '+u.topic.title));
  for(const w of qt){
    const f=tf[w];if(!f)continue;
    const n=ix.df[w]||0;
    const idf=Math.log(1+(ix.N-n+0.5)/(n+0.5));
    s+=idf*(f*(k1+1))/(f+k1*(1-b+b*u.tok.length/ix.avg));
    if(titleT.has(w)) s+=idf*0.8;
  }
  return s;
}

/* ------------ فهم السؤال ------------ */
const SUBJ=[
 ['sound','صوت|موجه|موجي|مرونه|مرونة|قصور|هوك|يونغ|بويسون|صلابه|قص'],
 ['optics','بصريات|ضوء|فوتون|هايغنز|فيرما|انكسار نظري'],
 ['lab','تجربه|مختبر|اسفيرومتر|منشور|الياف|استطاره|رايلي|snell'],
 ['astro','فلك|نجم|كوكب|مجره|شمس|قمر|كبلر|هابل|كويزر|برالاكس|فرسخ|مجري|سديم|كون'],
 ['elec','كهرباء|كهربائيه|كولوم|اوم|دائره|مجال كهربائي|تيار|مكثف|مقاومه']
];
const INTENTS=[
 ['summary',/(^| )(لخص|ملخص|خلاصه|اختصر|تلخيص)/],
 ['mem',/(حفظ|احفظ|حفظيات|نقاط مهمه|مهم للامتحان)/],
 ['hw',/(واجب|واجبات|تمارين الطالب)/],
 ['quiz',/(اختبر|كويز|امتحني|امتحان|اسئله اختيار)/],
 ['draw',/(ارسم|رسم|مخطط|شكل )/],
 ['where',/(^| )(اين|وين|بي صفحه|باي صفحه|اي صفحه|مكان|ملزمه)/],
 ['compare',/(قارن|الفرق|فرق|مقارنه)/],
 ['why',/(لماذا|علل|تعليل|سبب)/],
 ['solve',/(احسب|اوجد|جد |حل |مساله|مسائل|مثال|امثله|اذا كان|كم يساوي)/],
 ['law',/(قانون|معادله|صيغه|علاقه|قوانين)/],
 ['def',/(عرف|تعريف|ما هو|ما هي|ماذا يعني|يعني ما|مفهوم)/],
 ['simple',/(بسط|ابسط|اشرح|شرح|فهمني|طريقه ثانيه|بطريقه)/],
 ['list',/(عدد|اذكر|انواع|خصائص|مميزات|فوائد)/]
];
const TYPEMAP={def:['def','sum'],law:['law'],why:['qa','sum'],compare:['qa','def'],solve:['ex','hw','law'],hw:['hw'],mem:['mem'],list:['qa','def','sum'],simple:['sum','def'],summary:['sum'],draw:['sum'],where:['sum'],quiz:['qa']};
function detectSubject(q){
  const n=norm(q);const r=[];
  for(const [k,p] of SUBJ){const m=n.match(new RegExp(p,'g'));if(m)r.push([k,m.length]);}
  r.sort((a,b)=>b[1]-a[1]);return r.length?r[0][0]:null;
}
function parsePages(n){
  n=n.replace(/[٠-٩]/g,d=>AR_DIG[d]).replace(/[–—]/g,'-');
  const m=n.match(/(?:^|\s)(?:ص|صفحه|صفحة|p|page)\s*(\d+)(?:\s*(?:الى|الي|-|حتى|to)\s*(\d+))?/);
  if(m){const a=+m[1],b=m[2]?+m[2]:a;return [Math.min(a,b),Math.max(a,b)];}
  return null;
}
function parseChapter(n){
  const W={'الاول':1,'اول':1,'الثاني':2,'ثاني':2,'الثالث':3,'ثالث':3,'الرابع':4,'رابع':4,'الخامس':5,'خامس':5,'السادس':6,'سادس':6,'السابع':7,'سابع':7,'الثامن':8,'ثامن':8};
  const m=n.match(/(?:فصل|الفصل)\s*(\S+)/);
  if(!m)return null;const w=m[1];
  if(/^\d+$/.test(w))return +w;
  return W[w]||W[w.replace(/^ال/,'')]||null;
}
function understand(q){
  const n=norm(q);
  let intent=null;
  for(const [k,re] of INTENTS){if(re.test(n)){intent=k;break;}}
  const nums=(q.match(/-?\d+(?:\.\d+)?/g)||[]).length;
  if(!intent&&nums>=2&&/(احسب|اوجد|جد|اذا)/.test(n))intent='solve';
  return {raw:q,n,intent,subject:detectSubject(q),pages:parsePages(String(q).toLowerCase()),chapter:parseChapter(n),
    mcq:!!parseMCQ(q)};
}
function pageInRange(pg,rng){
  if(!pg||!rng)return false;
  const m=String(pg).match(/(\d+)(?:\D+(\d+))?/g);
  if(!m)return false;
  for(const part of String(pg).split('،')){
    const x=part.match(/\d+/g);if(!x)continue;
    const a=+x[0],b=x[1]?+x[1]:a;
    if(!(b<rng[0]||a>rng[1]))return true;
  }
  return false;
}

/* ------------ البحث ------------ */
function search(ix,qs,opt){
  opt=opt||{};
  const u=understand(qs);
  if(opt.subject)u.subject=opt.subject;
  let pool=ix.units;
  const info={u,widened:false};
  const subjOf=t=>t.s;
  if(u.subject){
    const f=pool.filter(x=>subjOf(x.topic)===u.subject||(u.subject==='lab'&&x.topic.t==='lab')||(u.subject==='optics'&&x.topic.s==='optics'));
    if(f.length)pool=f;
  }
  if(u.pages){const f=pool.filter(x=>pageInRange(x.topic.pg,u.pages));if(f.length)pool=f;}
  if(u.chapter){const f=pool.filter(x=>x.topic.chn===u.chapter);if(f.length)pool=f;}
  let qt=fixTypos(ix,tokens(qs));
  const want=(opt.prefer&&opt.prefer.length)?opt.prefer:(TYPEMAP[u.intent]||[]);
  const qset=new Set(qt);const run=P=>P.map(x=>{let s=bm25(ix,x,qt);if(qt.length>=2){if(!x._tt)x._tt=new Set(tokens(x.title));let c=0;qset.forEach(w=>{if(x._tt.has(w))c++;});const fr=c/qset.size;if(fr>=0.6)s+=fr*7;}if(s>0&&want.includes(x.type))s*=1.35;return [x,s];}).filter(r=>r[1]>0).sort((a,b)=>b[1]-a[1]);
  const wordTok=qt.filter(w=>!/^\d+(\.\d+)?$/.test(w)&&ix.df[w]);
  if(!wordTok.length){info.qt=qt;info.res=[];info.top=0;info.confident=false;return info;}
  let res=run(pool);
  if(!res.length&&pool!==ix.units&&!opt.strict){res=run(ix.units);info.widened=true;}
  info.qt=qt;
  info.res=res;
  info.top=res.length?res[0][1]:0;
  info.confident=info.top>=2.2;
  return info;
}
function topicsFor(ix,qs,subject,k){
  const qt=fixTypos(ix,tokens(qs));
  const sc={};
  ix.units.forEach(u=>{if(subject&&u.topic.s!==subject)return;const s=bm25(ix,u,qt);if(s>0){sc[u.topic.id]=(sc[u.topic.id]||0)+s;}});
  return Object.entries(sc).sort((a,b)=>b[1]-a[1]).slice(0,k||3).map(([id,s])=>[ix.topics.find(t=>t.id===id),s]);
}

/* ------------ أسئلة اختيار من متعدد ------------ */
function parseMCQ(t){
  const S=[{L:['a','b','c','d','e'],re:/(?:^|[\s\n])\(?([a-eA-E])[\)\.\-]\s*/g},{L:['أ','ب','ج','د','ه'],re:/(?:^|[\s\n])\(?([أاإبجده])[\)\.\-]\s*/g}];
  for(const s of S){const arr=[];let m;s.re.lastIndex=0;
    while((m=s.re.exec(t)))arr.push({l:m[1].toLowerCase().replace(/[اإ]/,'أ'),i:m.index,e:m.index+m[0].length});
    const seq=[];let want=0;
    for(let k=0;k<arr.length&&want<s.L.length;k++)if(arr[k].l===s.L[want]){seq.push(arr[k]);want++;}
    if(seq.length>=3&&seq[0].i>=8){const stem=t.slice(0,seq[0].i).replace(/\s+/g,' ').trim();if(stem.length<8)continue;
      return {stem,opts:seq.map((x,j)=>({k:x.l,t:t.slice(x.e,j+1<seq.length?seq[j+1].i:t.length).replace(/\s+/g,' ').trim().slice(0,150)}))};}}
  return null;
}
function rankMCQ(ix,m,subject){
  const ctx=search(ix,m.stem,{});
  const top=ctx.res.slice(0,3).map(r=>r[0]);
  const ctxTok=new Set();top.forEach(u=>u.tok.forEach(w=>ctxTok.add(w)));
  const scored=m.opts.map(o=>{
    const ot=tokens(o.t);let hit=0;ot.forEach(w=>{if(ctxTok.has(w))hit++;});
    return {k:o.k,t:o.t,hits:hit,s:ot.length?hit/ot.length:0};
  }).sort((a,b)=>b.hits-a.hits||b.s-a.s);
  const withHits=scored.filter(x=>x.hits>0);
  const ok=withHits.length===1&&scored[0].s>=0.5;
  return {scored,ok,src:top.slice(0,2)};
}
/* ------------ اختبار من القاعدة ------------ */
function makeQuiz(ix,subject,n,rng){
  rng=rng||Math.random;
  const qa=ix.units.filter(u=>u.type==='qa'&&(!subject||u.topic.s===subject)&&u.text.length<240&&u.topic.s!=='user');
  const pick=[];const pool=qa.slice();
  while(pick.length<n&&pool.length)pick.push(pool.splice(Math.floor(rng()*pool.length),1)[0]);
  return pick.map(u=>{
    const others=qa.filter(x=>x.id!==u.id&&x.text!==u.text)
      .map(x=>[x,(x.topic.id===u.topic.id?0:x.topic.s===u.topic.s?30:80)+Math.abs(x.text.length-u.text.length)/4+rng()*40])
      .sort((a,b)=>a[1]-b[1]).slice(0,3).map(x=>x[0].text);
    const opts=[u.text,...others].sort(()=>rng()-0.5);
    return {q:u.title,opts,ans:opts.indexOf(u.text),topic:u.topic.title,unit:u};
  });
}
function ocrQuery(ix,text){
  const raw=String(text||'').split(/\s+/).slice(0,120);
  let ar=0,known=[],extra=[];
  const seen=new Set();
  for(const w0 of raw){
    const n=norm(w0);if(!n)continue;
    for(let w of n.split(' ')){
      if(SYN[w])w=SYN[w];
      if(/^[\u0621-\u064A]{3,}$/.test(w)){
        if(STOP.has(w))continue;
        ar++;const st=stem(w);let k=null;
        if(ix.df[st])k=st;else{const fx=fixTypos(ix,[st])[0];if(fx!==st&&ix.df[fx]&&dice(tri(st),tri(fx))>=0.72)k=fx;}
        if(k&&!seen.has(k)){seen.add(k);known.push(k);}
      }else if(/^(p|a|e|f|k|n|y|mag|pc|ly|au)$/.test(w)||/^\d+(\.\d+)?$/.test(w)){extra.push(w);}
    }
  }
  return {query:known.join(' '),known,total:ar,quality:ar?known.length/ar:0,numbers:extra.filter(x=>/^\d/.test(x))};
}
const api={ocrQuery,norm,tokens,stem,buildIndex,search,understand,topicsFor,parseMCQ,rankMCQ,makeQuiz,pageInRange,fixTypos};
if(typeof module!=='undefined')module.exports=api;else root.AX=api;
})(typeof window!=='undefined'?window:globalThis);
