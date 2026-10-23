(function(){
var $=function(i){return document.getElementById(i)},uid=0,mode='',busy=false,sticky='';try{sticky=localStorage.getItem('ax.subj')||''}catch(e){}
var KB=window.KB||[],IX=AX.buildIndex(KB),extra=[];
var SUBJ=[{id:'astro',name:'الفلك',h:'251,191,36',ic:'<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"5\"/><ellipse cx=\"12\" cy=\"12\" rx=\"10.5\" ry=\"3.6\" transform=\"rotate(-20 12 12)\"/></svg>'},{id:'sound',name:'الصوت والموجات',h:'34,211,238',ic:'<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 12c1.7-8 4.3-8 6 0s4.3 8 6 0 4.3-8 6 0\"/></svg>'},{id:'lab',name:'مختبر البصريات',h:'248,113,113',ic:'<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"1.8\" y=\"9\" width=\"5\" height=\"6\" rx=\"1\"/><path d=\"M6.8 12h10.7\"/><path d=\"M20 7.8v8.4M16.8 9.9l6.4 4.2M23.2 9.9l-6.4 4.2\"/></svg>'},{id:'optics',name:'البصريات نظري',h:'250,204,21',ic:'<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3.5L21 19.5H3z\"/><path d=\"M1 14.5l6.4-2.5 9.4 1\"/><path d=\"M16.8 13l6.2-3.8M16.8 13l6.2.7M16.8 13l6.2 4.6\"/></svg>'}];
var SN={astro:'فيزياء الفلك والفضاء',sound:'الصوت والحركة الموجية',lab:'مختبر البصريات',optics:'البصريات (نظري)'};
function atom(on){var n='x'+(++uid),o='';
[0,60,120].forEach(function(r,i){o+='<g transform="rotate('+r+')"><use href="#p'+n+'" fill="none" stroke="rgba(196,170,255,.6)" stroke-width="1.1"/><circle r="3.2" '+(on?'':'cx="'+(30-i*18)+'" cy="'+(i*3)+'" ')+'fill="#fff">'+(on?'<animateMotion dur="'+(2.2+i*.5)+'s" begin="-'+(i*.7)+'s" repeatCount="indefinite"><mpath href="#p'+n+'"/></animateMotion>':'')+'</circle></g>'});
return '<svg viewBox="-50 -50 100 100" aria-hidden="true"><defs><radialGradient id="g'+n+'"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="#d8c6ff"/><stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/></radialGradient><path id="p'+n+'" d="M-42 0A42 15 0 1 0 42 0A42 15 0 1 0 -42 0"/></defs><circle r="16" fill="url(#g'+n+')" class="axc"/>'+o+'</svg>'}
document.querySelector('#ax-hd .lg').innerHTML=atom(0);
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function nl(s){return esc(s).replace(/\n/g,'<br>')}
function fmt(s){var h=esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/`(.+?)`/g,'<span class="axm">$1</span>'),out='',inl=false;
h.split('\n').forEach(function(l){var m=/^\s*[-•]\s+(.*)/.exec(l);if(m){if(!inl){out+='<ul>';inl=true}out+='<li>'+m[1]+'</li>'}else{if(inl){out+='</ul>';inl=false}out+=l?l+'<br>':''}});return out+(inl?'</ul>':'')}
var ms=$('ax-ms');
function add(c,h){var d=document.createElement('div');d.className='axb '+c;d.innerHTML=h;ms.appendChild(d);ms.scrollTop=ms.scrollHeight;return d}
function bot(t,extra){return add('a',fmt(t)+(extra||''))}
function sleep(n){return new Promise(function(r){setTimeout(r,n)})}
function loader(txt){var w=add('a','<div class="axl"><span class="ao">'+atom(1)+'</span><span class="at">'+txt+'…</span></div>');w.u=function(t){w.querySelector('.at').textContent=t+'…'};return w}
function done(){busy=false;$('ax-sd').disabled=false;ms.scrollTop=ms.scrollHeight}
function store(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function chips(a,attr){attr=attr||'data-q';return '<div class="axch">'+a.map(function(c){return '<button type="button" '+attr+'="'+esc(c)+'">'+esc(c)+'</button>'}).join('')+'</div>'}
function chipsL(a){return '<div class="axch">'+a.map(function(c){return '<button type="button" '+c[2]+'="'+esc(c[1])+'">'+esc(c[0])+'</button>'}).join('')+'</div>'}
/* ===== بطاقات المعرفة ===== */
function src(t){return '<div class="axsrc" style="font-size:12.5px;color:#d8c6ff;margin-top:8px">📄 '+esc(t.src)+' · '+esc(t.ch||'')+' · '+(/ص|تجربة|محاضرة/.test(t.pg)?esc(t.pg):'ص'+esc(t.pg))+'</div>'}
function unitHTML(u){var t=u.topic;
 if(u.type==='law')return '<span class="axlb">قانون</span><br><b>'+esc(u.title)+'</b><div class="axeq">'+esc(u.law.eq)+'</div>'+(u.law.note?'<div class="axnote">'+nl(u.law.note)+'</div>':'');
 if(u.type==='def')return '<span class="axlb">تعريف</span><br><b>'+esc(u.title)+'</b><br>'+nl(u.text);
 if(u.type==='qa')return '<span class="axlb">سؤال</span><br><b>'+esc(u.title)+'</b><br>'+nl(u.text);
 if(u.type==='ex'||u.type==='hw'){var ex=(t.ex||[]).concat(t.hw||[]).filter(function(e){return e.q===u.title})[0];return '<span class="axlb">'+(u.type==='hw'?'واجب':'مثال محلول')+'</span><br><b>'+nl(u.title)+'</b><div class="axsol">'+nl(u.text)+'</div>'+(ex&&ex.note?'<div class="axwarn">'+nl(ex.note)+'</div>':'')}
 if(u.type==='mem')return '<span class="axlb">حفظ</span><br>'+nl(u.text);
 return '<span class="axlb">ملخص</span><br><b>'+esc(t.title)+'</b><br>'+nl(t.sum)}
function topicCard(t){var h='<div class="axcard"><h3>'+esc(t.title)+'</h3>'+src(t)+'<p>'+nl(t.sum)+'</p>';
 if(t.note)h+='<div class="axwarn">'+nl(t.note)+'</div>';
 if(t.defs&&t.defs.length)h+='<h4>التعاريف</h4>'+t.defs.map(function(d){return '<p><b>'+esc(d[0])+':</b> '+nl(d[1])+'</p>'}).join('');
 if(t.laws&&t.laws.length)h+='<h4>القوانين</h4>'+t.laws.map(function(l){return '<b>'+esc(l.n)+'</b><div class="axeq">'+esc(l.eq)+'</div>'+(l.note?'<div class="axnote">'+nl(l.note)+'</div>':'')}).join('');
 if(t.fig&&AXFIG.has(t.fig))h+='<h4>رسم</h4>'+fig(t.fig);
 if(t.mem&&t.mem.length)h+='<h4>حفظيات</h4><ul>'+t.mem.map(function(m){return '<li>'+nl(m)+'</li>'}).join('')+'</ul>';
 if(t.qa&&t.qa.length)h+='<h4>أسئلة مناقشة</h4>'+t.qa.map(function(q){return '<details><summary>'+esc(q[0])+'</summary><p>'+nl(q[1])+'</p></details>'}).join('');
 if(t.ex&&t.ex.length)h+='<h4>أمثلة محلولة</h4>'+t.ex.map(function(e){return '<details><summary>'+nl(e.q)+'</summary><div class="axsol">'+nl(e.sol)+'</div>'+(e.note?'<div class="axwarn">'+nl(e.note)+'</div>':'')+'</details>'}).join('');
 if(t.hw&&t.hw.length)h+='<h4>واجبات</h4>'+t.hw.map(function(e){return '<details><summary>'+nl(e.q)+'</summary><div class="axsol">'+nl(e.sol)+'</div></details>'}).join('');
 return h+'</div>'}
function fig(k){return AXFIG.draw(k).replace('class="fig"','class="axfig"')}
function webQ(q,t){var n=AX.norm(q),tt=String(t.title).split(/[(،:]/)[0].trim().slice(0,60);return (q+(tt&&n.indexOf(AX.norm(tt))<0?' '+tt:'')+' فيزياء').replace(/\s+/g,' ').trim().slice(0,200)}
function actions(t,ex,q){var a=[['🧒 ابسطها لي','ابسطها لي: '+t.title,'data-q']];
 if(t.ex&&t.ex.length)a.push(['✏️ مثال محلول','مثال محلول على '+t.title,'data-q']);
 if(t.mem&&t.mem.length)a.push(['📝 حفظيات','حفظيات '+t.title,'data-q']);
 if(t.fig&&AXFIG.has(t.fig))a.push(['🖼️ ارسم','ارسم '+t.title,'data-q']);
 a.push(['🎯 اختبرني','اختبرني بـ '+SN[t.s],'data-q']);
 var h=chipsL(a.concat(ex||[]));
 if(q&&window.AXWEB&&AXWEB.enabled())h+='<div class="axch"><button type="button" class="axwebbtn" data-webq="'+esc(webQ(q,t))+'">🌐 وسّع بالويب</button></div>';
 return h}
/* ===== الحاسبات ===== */
function calcForm(s,pre){var h='<div class="axcard"><b>🧮 '+esc(s.name)+'</b><div class="axf" data-id="'+s.id+'">';
 s.fields.forEach(function(f){var v=pre&&pre[f.k]!=null?pre[f.k]:(f.def!=null?f.def:'');h+='<label>'+esc(f.l)+'<input inputmode="decimal" dir="ltr" data-k="'+f.k+'" value="'+v+'"></label>'});
 return h+'<button type="button" class="axgo" data-go="'+s.id+'">احسب بالخطوات</button></div></div>'}
function calcMenu(){var by={};AXC.list.forEach(function(s){(by[s.s]=by[s.s]||[]).push(s)});var h='<div class="axnote">اختر الحاسبة:</div>';
 Object.keys(by).forEach(function(k){h+='<div class="axsubj" style="margin-top:8px">'+esc(SN[k]||k)+'</div>'+chipsL(by[k].map(function(s){return [s.name,s.id,'data-calc']}))});return h}
function runCalc(b){var s=AXC.byId(b.dataset.go),f=b.closest('.axf'),raw={};f.querySelectorAll('input').forEach(function(i){raw[i.dataset.k]=i.value.trim()});
 var box=f.querySelector('.axres');if(!box){box=document.createElement('div');box.className='axres';f.appendChild(box)}
 try{var r=AXC.exec(s,raw);box.innerHTML=r.steps.map(function(x,i){return '<div class="axstep"><i style="color:var(--accent);font-style:normal;font-weight:800">'+(i+1)+'</i><span class="axeq" style="margin:0;flex:1">'+esc(x)+'</span></div>'}).join('')+'<div class="axfin">✅ '+esc(r.answer)+'</div>'+(r.note?'<div class="axwarn">'+esc(r.note)+'</div>':'')}
 catch(e){box.innerHTML='<div class="axwarn">'+esc(e.message)+'</div>'}
 ms.scrollTop=ms.scrollHeight}
function parseVals(q){var v={},re=/([a-zA-Zα-ωΑ-Ω]+[0-9₀-₉]*)\s*[=:]\s*(-?\d+(?:\.\d+)?(?:e-?\d+)?)/g,m;while((m=re.exec(q)))v[m[1]]=+m[2];return v}
/* ===== فهرس المنهج ===== */
function browseSubj(){if(sticky)browseChapters(sticky);else pickOpen()}
function browseChapters(sid){var seen=[],t=KB.filter(function(x){return x.s===sid});t.forEach(function(x){if(seen.indexOf(x.ch)<0)seen.push(x.ch)});
 var h='<div class="axnote">'+esc(SN[sid])+' — اختر الفصل أو التجربة:</div>'+chipsL(seen.map(function(c){return [c,sid+'|'+c,'data-brc']}));
 h+=chipsL([['📐 ورقة القوانين كاملة',sid,'data-form']]);add('a',h)}
function browseTopics(v){var p=v.split('|'),t=KB.filter(function(x){return x.s===p[0]&&x.ch===p[1]});add('a','<div class="axnote">'+esc(p[1])+':</div>'+chipsL(t.map(function(x){return [x.title,x.id,'data-top']})))}
function formulaSheet(sid){var h='<div class="axcard"><h3>📐 ورقة القوانين — '+esc(SN[sid])+'</h3>';
 KB.filter(function(t){return t.s===sid}).forEach(function(t){(t.laws||[]).forEach(function(l){h+='<b>'+esc(l.n)+'</b> <small>('+esc(t.title)+')</small><div class="axeq">'+esc(l.eq)+'</div>'})});add('a',h+'</div>')}
/* ===== اختبار داخل المحادثة ===== */
var QZ=null;
function quizStart(sid){var items=AX.makeQuiz(IX,sid||null,8);if(!items.length){bot('ما عندي أسئلة كافية لهذي المادة.');return}
 QZ={items:items,i:0,ok:0,bad:[],sid:sid};bot('تمام! **8 أسئلة** من '+(sid?SN[sid]:'كل المواد')+'. اختر الجواب الصح:');quizAsk()}
function quizAsk(){var it=QZ.items[QZ.i];add('a','<div class="axcard"><div class="axnote">سؤال '+(QZ.i+1)+' من '+QZ.items.length+'</div><b>'+esc(it.q)+'</b>'+it.opts.map(function(o,k){return '<button type="button" class="axopt" data-qzo="'+k+'">'+esc(o)+'</button>'}).join('')+'<div class="axqf"></div></div>')}
function quizPick(b){var k=+b.dataset.qzo,card=b.closest('.axcard'),it=QZ.items[QZ.i],o=card.querySelectorAll('.axopt');
 o.forEach(function(x){x.disabled=true});o[it.ans].classList.add('ok');if(k===it.ans)QZ.ok++;else{b.classList.add('no');QZ.bad.push(it.topic)}
 var last=QZ.i>=QZ.items.length-1;card.querySelector('.axqf').innerHTML=src(it.unit.topic)+'<div class="axch"><button type="button" data-qzn="1">'+(last?'عرض النتيجة':'التالي ←')+'</button></div>';ms.scrollTop=ms.scrollHeight}
function quizNext(b){b.parentNode.remove();QZ.i++;if(QZ.i>=QZ.items.length){var u={};QZ.bad.forEach(function(x){u[x]=1});var bd=Object.keys(u);
  add('a','<div class="axcard"><h3>النتيجة: '+QZ.ok+' / '+QZ.items.length+'</h3>'+(bd.length?'<h4>راجع هذي المواضيع:</h4>'+bd.map(function(x){return '<p>• '+esc(x)+'</p>'}).join(''):'<p>ممتاز! 🎉</p>')+chipsL([['اختبار جديد',QZ.sid||'','data-qzs']])+'</div>');QZ=null}else quizAsk()}
/* ===== بطاقات الحفظ (تكرار متباعد) ===== */
var FC=null,DAYS=[0,1,3,7,14,30];
function deck(sid){var st=store('ax_fc',{}),now=Date.now(),a=[];
 IX.units.forEach(function(u){if(['def','mem','law'].indexOf(u.type)<0)return;if(u.topic.src&&u.topic.s==='user')return;if(sid&&u.topic.s!==sid)return;if(u.type==='mem'&&u.text.length>140)return;
  var id=u.topic.id+'|'+u.type+'|'+u.id,s=st[id]||{box:0,due:0};if(s.due<=now)a.push({id:id,q:u.type==='mem'?u.topic.title:(u.type==='law'?'اكتب قانون: '+u.title:'عرّف: '+u.title),a:u.type==='law'?u.law.eq:u.text,box:s.box})});
 return a.sort(function(x,y){return x.box-y.box||Math.random()-.5})}
function fcStart(sid){var d=deck(sid);if(!d.length){bot('خلصت بطاقات اليوم 🎉 ارجع بعدين.');return}FC={sid:sid,n:d.length};fcShow(d[0])}
function fcShow(c){FC.cur=c;add('a','<div class="axcard"><div class="axnote">متبقي '+FC.n+' بطاقة</div><div class="axflash" data-fcq="1">'+esc(c.q)+'</div><div class="axch"><button type="button" data-fc="flip">إظهار الجواب</button></div></div>')}
function fcAct(b){var card=b.closest('.axcard'),a=b.dataset.fc;
 if(a==='flip'){card.querySelector('.axflash').insertAdjacentHTML('beforeend','<div class="eqw">'+nl(FC.cur.a)+'</div>');card.querySelector('.axch').outerHTML='<div class="axrow"><button type="button" class="axgo no" data-fc="no">ما عرفتها</button><button type="button" class="axgo ok" data-fc="ok">عرفتها</button></div>';ms.scrollTop=ms.scrollHeight;return}
 var st=store('ax_fc',{}),s=st[FC.cur.id]||{box:0,due:0},ok=a==='ok';s.box=ok?Math.min(5,s.box+1):0;s.due=Date.now()+(ok?DAYS[s.box]*864e5:6e4);st[FC.cur.id]=s;save('ax_fc',st);
 card.querySelector('.axrow').remove();var d=deck(FC.sid);if(!d.length){add('a','<div class="axnote">خلصت بطاقات اليوم 🎉</div>');FC=null}else{FC.n=d.length;fcShow(d[0])}}
/* ===== الفهم والإجابة ===== */
var CMD=/(^| )(لخص|ملخص|خلاصه|اختصر|حفظيات|احفظ|واجبات|واجب|ارسم|رسم|اشرح|بسط|وين اجد|اين اجد|بي صفحه|باي صفحه|اختبرني|امتحني|مثال|امثله|فلك|صوت|بصريات|مختبر|مادة|مادة)( |$)/g;
function residual(q){return AX.norm(q).replace(/(ال)?فصل\s*\S+/g,' ').replace(CMD,' ').replace(/ص\s*\d+(\s*(الى|-|حتى)\s*\d+)?/g,' ').replace(/\s+/g,' ').trim()}
function scopeTopics(u){var ts=KB.slice();if(u.subject)ts=ts.filter(function(t){return t.s===u.subject||(u.subject==='lab'&&t.t==='lab')});
 if(u.pages)ts=ts.filter(function(t){return AX.pageInRange(String(t.pg).replace(/[^\d\-،]/g,''),u.pages)});if(u.chapter)ts=ts.filter(function(t){return t.chn===u.chapter});return ts}
function notFound(q){var us=AX.understand(q).subject,sw='',near=AX.topicsFor(IX,q,sticky||null,3),h='<div class="axcard"><b>ما لكيت جواب مؤكد لهذا السؤال'+(sticky?' ضمن مادة «'+esc(SN[sticky])+'»':'')+'.</b>'+sw+'<p>أكدر أبحث عنه بالويب، أو جرّب واحد من الأقرب:</p>';
 h+=near.length?chips(near.map(function(n){return 'لخص '+n[0].title})):'<div class="axnote">يبدو السؤال خارج المنهج المضاف حالياً.</div>';
 if(window.AXWEB&&AXWEB.enabled())h+='<div class="axch"><button type="button" class="axwebbtn" data-webq="'+esc(q)+'">🌐 ابحث بالويب</button></div>';
 var C=window.AX_CONFIG||{};if(C.whatsapp)h+='<div class="axch"><a class="axlk" target="_blank" rel="noopener" href="https://wa.me/'+C.whatsapp+'?text='+encodeURIComponent('سؤال ما جاوبه المساعد:\n'+q)+'">📩 أرسل السؤال للأستاذ (واتساب)</a></div>';return h+'</div>'}
function clarify(q,u){
 var n=AX.norm(q), opts=[];
 if(/(^| )(السرعه|سرعه)( |$)/.test(n)&&!/(متوسطه|لحظيه|المتجهه)/.test(n))opts=[['السرعة المتوسطة','اشرح السرعة المتوسطة'],['السرعة اللحظية','اشرح السرعة اللحظية'],['فرق السرعة والسرعة المتجهة','قارن بين السرعة والسرعة المتجهة']];
 else if(/(^| )(قانون|معادله)( |$)/.test(n)&&!AX.tokens(q).some(function(x){return x.length>3&&x!=='قانون'&&x!=='معادله'}))opts=[['قوانين الحركة','اعطني قوانين الحركة'],['قوانين نيوتن','اعطني قوانين نيوتن'],['قوانين الكهرباء','اعطني قوانين الكهرباء']];
 else if(/(^| )(الضوء|ضوء)( |$)/.test(n)&&!/(انكسار|انعكاس|حيود|تداخل|استقطاب)/.test(n))opts=[['الانكسار','اشرح انكسار الضوء'],['الانعكاس','اشرح انعكاس الضوء'],['الحيود','اشرح حيود الضوء'],['التداخل','اشرح تداخل الضوء']];
 if(!opts.length)return false;
 add('a','<div class="axcard axclar"><b>حتى أعطيك الجواب الصحيح، شنو تقصد؟</b>'+chipsL(opts.map(function(x){return [x[0],x[1],'data-q']}))+'</div>');
 return true;
}
async function webAnswer(q){
 if(!(window.AXWEB&&AXWEB.enabled())){add('a','<div class="axcard"><b>بحث الويب غير مفعّل بعد.</b><p>اربط رابط خدمة البحث في <code>config.js</code> أولاً.</p></div>');return}
 var w=loader('أبحث بالويب');
 try{var d=await AXWEB.search(q,{subject:sticky});w.remove();
   if(!d.items.length){bot('ما ظهرت نتائج مناسبة من Google لهذا السؤال.');return}
   add('a',AXWEB.cards(d));
 }catch(e){w.remove();add('a','<div class="axcard"><b>تعذر بحث الويب.</b><div class="axwarn">'+esc(e.message||'خطأ غير معروف')+'</div></div>')}
}
/* ===== نظام نطاق المنهج: هل السؤال داخل المنهج؟ (scope.js) ===== */
function outCard(q,sc,web){var subs=[],C=window.AX_CONFIG||{};KB.forEach(function(t){if(subs.indexOf(t.s)<0&&SN[t.s])subs.push(t.s)});
 var why=sc.kind==='e'?'موضوع الكهربائية والمغناطيسية غير مضاف لملازم المساعد حالياً.':sc.kind==='p'?'هذا موضوع فيزيائي لكنه مو من الملازم المضافة.':'ما لكيت بالسؤال أي مصطلح من ملازم المنهج.';
 var h='<div class="axcard"><b>هذا السؤال خارج المنهج.</b><p>'+why+(web?' ما أجاوب عليه من الملازم، لكن هذي نتائج بحث من الويب (مو من الملازم):':' أجاوب فقط من ملازم المنهج حتى ما أعطيك معلومة غير مضمونة.')+'</p><div class="axnote">المواد المضافة: '+esc(subs.map(function(s){return SN[s]}).join(' · '))+'</div>'+chipsL([['📚 فهرس المنهج','المنهج','data-q']]);
 if(!web&&window.AXSCOPE&&AXSCOPE.webButton()&&window.AXWEB&&AXWEB.enabled())h+='<div class="axch"><button type="button" class="axwebbtn" data-webq="'+esc(q)+'">🌐 ابحث بالويب</button></div>';
 if(C.whatsapp)h+='<div class="axch"><a class="axlk" target="_blank" rel="noopener" href="https://wa.me/'+C.whatsapp+'?text='+encodeURIComponent('سؤال خارج المنهج بحسب المساعد:\n'+q)+'">📩 أرسل السؤال للأستاذ (واتساب)</a></div>';
 return h+'<div class="axnote">إذا تشوف السؤال من المنهج، أعد صياغته بمصطلح الملزمة.</div></div>'}
function scopeGate(q,o){
 if(!(window.AXSCOPE&&AXSCOPE.enabled()))return false;
 var mc=AX.parseMCQ(q),txt=mc?mc.stem:q,img=!!(o&&o.ocr);if(img)txt=(q+' '+o.ocr).trim();
 var sc=AXSCOPE.classify(IX,txt,{lenient:img});
 if(sc.verdict==='chat'){bot('هلا بيك 😊 أنا مساعد الفيزياء، أجاوب من ملازم المنهج. اكتب سؤالك، أو جرّب `المنهج` / `اختبرني` / `حاسبات`.');return true}
 if(sc.verdict==='out'){var web=AXSCOPE.webOnOut()&&window.AXWEB&&AXWEB.enabled();add('a',outCard(q,sc,web));return web?'web':true}
 return false}
async function answer(text,o){o=o||{};var q=text,u=AX.understand(q),n=AX.norm(q),sub=sticky||u.subject||null,det=u.subject;if(sticky)u.subject=sticky;
 var w=loader('أبحث بالمحاضرة والملازم');await sleep(350);w.remove();
 if(/^(هلا|مرحبا|السلام عليكم|اهلا|هاي|صباح الخير|مساء الخير)/.test(n)){bot('هلا بيك! 👋 اسألني عن أي موضوع من الملازم، أو اكتب مثلاً: `لخص قوانين كبلر` · `احسب البعد اذا p=0.1` · `اختبرني بالفلك`.');return}
 if(/^(شكرا|مشكور|تسلم|يعطيك العافيه|ممنون)/.test(n)){bot('العفو، بالتوفيق! 🌟');return}
 if(/^(حاسبات|الحاسبات|مسائل|حاسبه)$/.test(n)){add('a',calcMenu());return}
 if(/^(المنهج|فهرس|فهرس المنهج|المواد)$/.test(n)){browseSubj();return}
 if(/^(بطاقات|بطاقات الحفظ|حفظ)$/.test(n)){fcStart(sticky);return}
 var m2=q.match(/^ابسطها لي:\s*(.+)$/);
 if(m2){var t=KB.filter(function(t){return t.title===m2[1].trim()})[0];if(t){add('a','<div class="axcard"><h3>🧒 بطريقة أبسط: '+esc(t.title)+'</h3><p>'+nl(t.simple||t.sum)+'</p>'+(t.mem?'<h4>تذكّر:</h4><ul>'+t.mem.slice(0,3).map(function(m){return '<li>'+nl(m)+'</li>'}).join('')+'</ul>':'')+src(t)+'</div>'+actions(t));return}}
 m2=q.match(/^مثال محلول على\s*(.+)$/);
 if(m2){var t2=KB.filter(function(t){return t.title===m2[1].trim()})[0];if(t2&&t2.ex){add('a','<div class="axcard"><h3>✏️ '+esc(t2.title)+'</h3>'+t2.ex.map(function(e){return '<p><b>'+nl(e.q)+'</b></p><div class="axsol">'+nl(e.sol)+'</div>'+(e.note?'<div class="axwarn">'+nl(e.note)+'</div>':'')}).join('')+'</div>'+(t2.solver?chipsL([['🧮 '+AXC.byId(t2.solver).name,t2.solver,'data-calc']]):''));return}}
 if(u.intent==='quiz'){quizStart(sticky);return}
 var sg=scopeGate(q,o);if(sg){if(sg==='web')await webAnswer((o&&o.ocr&&!q.trim())?o.ocr.slice(0,300):q);return}
 var mc=AX.parseMCQ(q);
 if(mc){var r=AX.rankMCQ(IX,mc),h='<div class="axcard"><b>سؤال اختيار من متعدد</b>';
  if(r.ok)h+='<div class="axfin">الخيار الأقرب للملزمة: ('+esc(r.scored[0].k)+') '+esc(r.scored[0].t)+'</div><div class="axnote">اعتمدت على تطابق النص مع الملزمة، وليس حلاً محسوباً. تأكد من النص أدناه.</div>';
  else h+='<div class="axwarn">ما كدرت أحدد خياراً بثقة. هذا أقرب نص بالملزمة، قارن بنفسك:</div>';
  if(r.src[0])h+=src(r.src[0].topic)+'<p>'+nl(r.src[0].text.slice(0,350))+'</p>';add('a',h+'</div>');return}
 if(u.intent==='where'&&!u.pages){var rr=AX.topicsFor(IX,residual(q)||q,u.subject,4);
  if(rr.length){add('a','<div class="axcard"><b>📍 لكيته هنا:</b>'+rr.map(function(x){return '<p><b>'+esc(x[0].title)+'</b>'+src(x[0])+'</p>'}).join('')+'</div>'+chips(rr.slice(0,3).map(function(x){return 'لخص '+x[0].title})));return}}
 if(clarify(q,u))return;
 var res=residual(q);
 if(['summary','mem','hw','draw'].indexOf(u.intent)>-1||(u.pages&&!res)){
  var near=res.length>2?AX.topicsFor(IX,res,u.subject,1):[],ts=(near.length&&near[0][1]>3)?[near[0][0]]:scopeTopics(u);
  if(u.intent==='draw'){ts=ts.filter(function(t){return t.fig&&AXFIG.has(t.fig)});if(!ts.length){bot('ما عندي رسم جاهز لهذا الموضوع. جرّب: `ارسم الانكسار` / `ارسم المنشور` / `ارسم الألياف` / `ارسم الاستطارة` / `ارسم مخطط H-R` / `ارسم المجرة`.');return}
   add('a','<div class="axcard"><h3>'+esc(ts[0].title)+'</h3>'+fig(ts[0].fig)+src(ts[0])+'</div>'+actions(ts[0]));return}
  if(ts.length===1){var t3=ts[0];
   if(u.intent==='mem'&&t3.mem)add('a','<div class="axcard"><h3>📝 حفظيات: '+esc(t3.title)+'</h3>'+src(t3)+'<ul>'+t3.mem.map(function(m){return '<li>'+nl(m)+'</li>'}).join('')+'</ul></div>'+actions(t3));
   else if(u.intent==='hw'&&t3.hw)add('a','<div class="axcard"><h3>📚 واجبات: '+esc(t3.title)+'</h3>'+t3.hw.map(function(e){return '<details open><summary>'+nl(e.q)+'</summary><div class="axsol">'+nl(e.sol)+'</div></details>'}).join('')+'</div>'+actions(t3));
   else add('a',topicCard(t3)+actions(t3));return}
  if(ts.length){var lab=(u.subject?SN[u.subject]:'المنهج')+(u.chapter?' — الفصل '+u.chapter:'')+(u.pages?' — ص'+u.pages[0]+(u.pages[1]!==u.pages[0]?'-'+u.pages[1]:''):''),hh='<div class="axcard"><h3>'+(u.intent==='mem'?'📝 حفظيات ':u.intent==='hw'?'📚 واجبات ':'📋 ملخص ')+esc(lab)+'</h3>';
   ts.forEach(function(t){
    if(u.intent==='mem'){if(t.mem)hh+='<h4>'+esc(t.title)+'</h4><ul>'+t.mem.map(function(m){return '<li>'+nl(m)+'</li>'}).join('')+'</ul>'}
    else if(u.intent==='hw'){if(t.hw)hh+='<h4>'+esc(t.title)+'</h4>'+t.hw.map(function(e){return '<details><summary>'+nl(e.q)+'</summary><div class="axsol">'+nl(e.sol)+'</div></details>'}).join('')}
    else hh+='<h4>'+esc(t.title)+' <small>('+esc(t.pg)+')</small></h4><p>'+nl(t.sum)+'</p>'});
   add('a',hh+'</div>'+chips(ts.slice(0,4).map(function(t){return 'لخص '+t.title})));return}}
 var nums=(q.match(/-?\d+(?:\.\d+)?/g)||[]).length;
 if((u.intent==='solve'&&nums>=1)||(mode==='p'&&nums>=1)){var cand=AXC.pick(IX,q);
  if(cand.length){add('a','<div class="axnote">فهمت إنها مسألة حسابية. أكمل القيم واضغط احسب:</div>'+calcForm(cand[0],parseVals(q))+(cand[1]?chipsL(cand.slice(1,3).map(function(x){return ['🧮 '+x.name,x.id,'data-calc']})):''));
   var sim=AX.search(IX,q,{subject:sub,prefer:['ex','hw']}),ex=sim.res.filter(function(r){return r[0].type==='ex'||r[0].type==='hw'})[0];
   if(ex)add('a','<div class="axcard"><b>مثال مشابه من الملزمة:</b><br>'+unitHTML(ex[0])+src(ex[0].topic)+'</div>');return}}
 var pf=mode==='k'?['def','law','mem','qa']:mode==='p'?['ex','hw','law']:null;
 var r2=AX.search(IX,q,{subject:sub,prefer:pf,strict:true});
 if(!r2.res.length||r2.top<2.2||(sticky&&det&&det!==sticky&&SN[det]&&r2.top<12)){
   add('a',notFound(q));
   if(window.AXWEB&&AXWEB.enabled()&&!clarify(q,u)) await webAnswer(q);
   return
 }
 var best=r2.res[0][0],seen={},more=[];seen[best.id]=1;
 for(var i=0;i<r2.res.length&&more.length<3;i++){var x=r2.res[i][0],s=r2.res[i][1];if(seen[x.id]||s<r2.top*.45||x.text===best.text)continue;seen[x.id]=1;more.push(x)}
 var h2='<div class="axcard">'+(r2.widened?'<div class="axnote">ما لكيت ضمن المادة المحددة فوسّعت البحث على كل المواد.</div>':'')+unitHTML(best)+src(best.topic);
 if(best.topic.note)h2+='<div class="axwarn">'+nl(best.topic.note)+'</div>';
 if(best.topic.fig&&AXFIG.has(best.topic.fig)&&(best.type==='sum'||best.type==='def'))h2+=fig(best.topic.fig);
 h2+='</div>';
 if(more.length)h2+='<details class="axr"><summary>مواضع/طرق أخرى للجواب ('+more.length+')</summary>'+more.map(function(x){return '<div class="axcard">'+unitHTML(x)+src(x.topic)+'</div>'}).join('')+'</details>';
 var rel=[];if(best.topic.solver)rel.push(['🧮 '+AXC.byId(best.topic.solver).name,best.topic.solver,'data-calc']);
 if(/(احسب|حساب|كيف|شلون)/.test(n))AXC.pick(IX,q).slice(0,1).forEach(function(sv){if(!rel.some(function(r){return r[1]===sv.id}))rel.push(['🧮 '+sv.name,sv.id,'data-calc'])});
 add('a',h2+actions(best.topic,rel,q))}
/* ===== OCR: تنظيف وفلترة ===== */
function cleanOcr(t){return(t||'').split('\n').map(function(l){return l.replace(/\b[A-Za-z]{4,}\b/g,' ').replace(/[|~_`<>«»£§$¢©\\\/]/g,' ').replace(/\s+/g,' ').trim()}).filter(function(l){var ar=(l.match(/[\u0621-\u064A]/g)||[]).length;return ar>=3||(/[=\d]/.test(l)&&l.length>=5)}).join('\n')}
var pend=null;
function setPend(f){pend=f;var a=$('ax-at');a.classList.toggle('on',!!f);a.innerHTML=f?'<img alt="" src="'+URL.createObjectURL(f)+'"><span>'+esc(f.name||'صورة السؤال')+'</span><button type="button" id="ax-ar" aria-label="إزالة الصورة">✕</button>':''}
async function send(q,keep){q=(q||'').trim().slice(0,500);var img=pend;if((!q&&!img)||busy)return;
 busy=true;$('ax-sd').disabled=true;var em=$('ax-em');if(em){em.remove();ms.classList.remove('emp')}
 add('u',(img?'<img class="axim" alt="" src="'+URL.createObjectURL(img)+'">':'')+(q?esc(q):''));
 $('ax-in').value='';$('ax-in').style.height='';setPend(null);
 var text=q;
 if(img){var w=loader('أقرأ الصورة'),res;
  try{res=await AXS.ocr(img,function(m){if(!m)return;if(m.status==='recognizing text')w.u('أقرأ الصورة '+Math.round(m.progress*100)+'%');else if(/load|initializ/.test(m.status||''))w.u('أجهّز قارئ العربي (أول مرة فقط، يحتاج انترنت)')})}
  catch(e){w.remove();bot('ما كدرت أقرأ الصورة ('+(e.message||'خطأ')+'). اكتب السؤال نصاً.');done();return}
  w.remove();var cl=cleanOcr(res.text),oq=AX.ocrQuery(IX,cl);
  var ta='<details class="axocr" open><summary>شنو قرأت من الصورة؟ (عدّل وأعد البحث)</summary><textarea class="axta" rows="4">'+esc(cl.slice(0,400))+'</textarea><button type="button" class="axbtn" data-re="1">ابحث بهذا النص</button></details>';
  if(oq.known.length<2||(oq.quality<0.3&&oq.known.length<4)){
   add('a','<div class="axcard"><b>ما كدرت أفهم الصورة بوضوح.</b><div class="axnote">النص طلع مشوّشاً ('+oq.known.length+' كلمة مفهومة من المنهج). نصائح: **اقص حول السؤال فقط**، صوّر بإضاءة قوية وبدون ظل، وخلي الورقة مستوية. القراءة الآلية تشتغل على النص المطبوع فقط، وما تقرأ خط اليد بشكل جيد.</div>'+ta+'</div>');
   done();return}
  add('a','<div class="axund" style="font-size:12.5px;color:#d8c6ff">🧭 فهمت من الصورة: '+esc(oq.known.join(' · '))+'</div>'+ta);
  text=(q+' '+oq.query).trim().slice(0,300)}
 try{await answer(text,{ocr:img?cl:''})}catch(e){bot('صار خطأ: '+(e.message||e))}
 done()}
/* ===== شريط المواد + القوائم ===== */
function subjName(){return(SUBJ.filter(function(x){return x.id===sticky})[0]||{}).name||''}
function phd(){return sticky?'اسأل عن '+subjName()+'...':'اسأل أي سؤال بالفيزياء...'}
function renderSubj(){$('ax-sbl').textContent=sticky?subjName():'كل المواد';var cs=SUBJ.filter(function(x){return x.id===sticky})[0];$('ax-sb').style.setProperty('--h',cs?cs.h:'139,92,246');if(!mode)$('ax-in').placeholder=phd()}
function pickCards(){return '<div class="scs">'+SUBJ.map(function(x){var n=KB.filter(function(t){return t.s===x.id}).length;return '<button type="button" class="sc'+(sticky===x.id?' on':'')+'" style="--h:'+x.h+'" data-pick="'+x.id+'"><span class="si">'+x.ic+'</span><b>'+esc(x.name)+'</b><small>'+n+' موضوع</small></button>'}).join('')+'</div>'}
function pickOpen(){$('ax-pc').innerHTML=pickCards()+'<button type="button" class="axall'+(sticky?'':' on')+'" data-pick="">كل المواد</button>';$('ax-ps').classList.add('on')}
function pickClose(){$('ax-ps').classList.remove('on')}
function setSubject(id,hint){id=id||'';if(id&&!SN[id])return;var ch=id!==sticky;sticky=id;try{localStorage.setItem('ax.subj',id)}catch(e){}QZ=null;pickClose();renderSubj();
 if($('ax-em'))renderEmpty();else if(ch||hint)add('a',(id?'<div class="axnote">✅ تم التحويل إلى مادة <b>'+esc(SN[id])+'</b> — الأجوبة هسه من ملازمها فقط.</div>':'<div class="axnote">✅ هسه أبحث بكل المواد.</div>'))}
var ORB='<div class="orbit" aria-hidden="true"><i></i><i></i><b></b><b></b></div>';
function renderEmpty(){var em=$('ax-em');if(!em)return;
 if(!sticky){em.innerHTML=ORB+'<h2>شنو تريد تسأل؟</h2><p>اكتب سؤالك أو صوّر المسألة 📷 — أو اختر مادتك من الزر فوق حتى تجي الإجابة من ملازمها فقط.</p>'+chips(['لخص قوانين كبلر','شنو قانون يونغ','لماذا السماء زرقاء','اختبرني']);return}
 var ts=KB.filter(function(t){return t.s===sticky}),n=Math.min(4,ts.length),pk=[];for(var i=0;i<n;i++)pk.push('لخص '+ts[Math.floor(i*ts.length/n)].title);pk.push('اختبرني');
 em.innerHTML=ORB+'<h2>شنو تريد تدرس بـ'+esc(subjName())+'؟</h2><p>اكتب سؤالك أو صوّر المسألة 📷 — أو اختر من <b>+</b> حفظيات / مسائل / اختبار / بطاقات / فهرس:</p><div class="axch">'+pk.map(function(t){return '<button type="button" data-q="'+esc(t)+'">'+esc(t)+'</button>'}).join('')+'</div><p class="axls">'+ts.length+' موضوع · '+IX.units.filter(function(u){return u.topic.s===sticky}).length+' وحدة معرفة</p>'}
$('ax-sb').onclick=pickOpen;
$('ax').addEventListener('pointermove',function(e){if(e.pointerType!=='mouse')return;var c=e.target.closest&&e.target.closest('.sc');if(!c)return;var r=c.getBoundingClientRect();c.style.setProperty('--px',(e.clientX-r.left)+'px');c.style.setProperty('--py',(e.clientY-r.top)+'px')});
$('ax').addEventListener('click',function(e){var b=e.target.closest('[data-pick]');if(b){setSubject(b.dataset.pick);return}if(e.target===$('ax-ps'))pickClose()});
function setMode(m){mode=m;$('ax-md').classList.toggle('on',!!m);$('ax-mt').textContent=m==='k'?'نمط: حفظيات':m==='p'?'نمط: مسائل':'';$('ax-in').placeholder=m==='p'?'اكتب المسألة مع الأرقام، مثل: احسب البعد اذا p=0.1':m==='k'?'اسأل عن تعريف أو قانون...':phd();sh(false);$('ax-in').focus()}
function sh(o){$('ax-sh').classList.toggle('on',o);$('ax-pl').classList.toggle('on',o);$('ax-pl').setAttribute('aria-expanded',o)}
$('ax-pl').onclick=function(){sh(!$('ax-sh').classList.contains('on'))};
function startAct(m){var em=$('ax-em');if(em){em.remove();ms.classList.remove('emp')}sh(false);
 if(m==='z'){quizStart(sticky)}
 else if(m==='c'){fcStart(sticky)}
 else if(m==='b'){browseSubj()}
 else if(m==='p'){setMode('p');add('a',calcMenu())}
 else setMode(m)}
document.querySelectorAll('#ax-sh [data-m]').forEach(function(b){b.onclick=function(){var m=b.dataset.m;if(m==='k')setMode('k');else startAct(m)}});
$('ax-mc').onclick=function(){setMode('')};
/* ===== نقرات داخل المحادثة ===== */
ms.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var d=b.dataset;
 if(d.re!==undefined){var ta=b.parentNode.querySelector('textarea');if(ta)send(ta.value,1);return}
 if(d.q){send(d.q,1);return}
 if(d.calc){add('a',calcForm(AXC.byId(d.calc)));return}
 if(d.go){runCalc(b);return}
 if(d.sw!==undefined){setSubject(d.sw,1);return}
  if(d.br!==undefined){browseChapters(d.br);return}
 if(d.brc!==undefined){browseTopics(d.brc);return}
 if(d.top){var t=KB.filter(function(x){return x.id===d.top})[0];if(t)add('a',topicCard(t)+actions(t));return}
 if(d.form!==undefined){formulaSheet(d.form);return}
 if(d.qzs!==undefined){quizStart(d.qzs);return}
 if(d.qzo!==undefined){quizPick(b);return}
 if(d.qzn!==undefined){quizNext(b);return}
 if(d.fcs!==undefined){fcStart(d.fcs);return}
 if(d.fc){fcAct(b);return}
 if(d.webq!==undefined){webAnswer(d.webq)} });
$('ax-at').addEventListener('click',function(e){if(e.target.closest('#ax-ar'))setPend(null)});
$('ax-im').onclick=function(){$('ax-fi').click()};
$('ax-fi').onchange=function(){var f=this.files[0];this.value='';if(f)AXS.crop(f).then(function(c){if(c)setPend(c)})};
document.querySelector('#ax-sh [data-act="pdf"]').onclick=function(){sh(false);$('ax-pf').click()};
$('ax-pf').onchange=async function(){var fs=[].slice.call(this.files);this.value='';if(!fs.length||busy)return;
 busy=true;$('ax-sd').disabled=true;var em=$('ax-em');if(em){em.remove();ms.classList.remove('emp')}
 for(var k=0;k<fs.length;k++){var f=fs[k],w=loader('أقرأ '+esc(f.name));
  try{var ch=await AXS.extractPdf(f,function(i,n){w.u('أقرأ الملزمة ('+i+'/'+n+')')},{});w.remove();
   if(ch.length){var nm=f.name.replace(/\.pdf$/i,'');
    ch.forEach(function(c,i){extra.push({id:'user-'+nm+'-'+i,s:sticky||'user',t:'theory',chn:0,ch:'ملزمتك المضافة',title:nm+' — ص'+c.p,pg:'ص'+c.p,kw:'',sum:c.t,src:nm})});
    IX=AX.buildIndex(KB.concat(extra));bot('تمت إضافة **'+ch.length+'** مقطع من «'+f.name+'». هسه تظهر نتائجها مع باقي الأجوبة.')}
   else bot('ما طلع نص من «'+f.name+'»، يمكن ممسوحة ضوئياً (صور).')}
  catch(e){w.remove();bot('فشلت قراءة «'+f.name+'»: '+(e.message||'خطأ'))}}
 done()};
/* ===== فتح/إغلاق (نفس السلوك الأصلي) ===== */
var sy=0,vv=window.visualViewport,fraf=0,kbOn=false,lh=-1,lt=-1;
/* v12: الحاوية تبقى ثابتة بملء الشاشة؛ نغيّر المقاس فقط لما تظهر لوحة المفاتيح، ونجمّع الأحداث بإطار واحد */
function fit(){fraf=0;var a=$('ax');if(!vv)return;
 var kb=window.innerHeight-vv.height>120;
 if(kb){var h=Math.round(vv.height),t=Math.round(vv.offsetTop);
  if(h!==lh){lh=h;a.style.setProperty('--axh',h+'px')}
  if(t!==lt){lt=t;a.style.setProperty('--axt',t+'px')}}
 if(kb!==kbOn){kbOn=kb;a.classList.toggle('kb',kb);ms.scrollTop=ms.scrollHeight}}
function qfit(){if(!fraf)fraf=requestAnimationFrame(fit)}
if(vv){vv.addEventListener('resize',qfit);vv.addEventListener('scroll',qfit)}
addEventListener('orientationchange',qfit);
function lock(o){var b=document.body;if(o){sy=window.scrollY;b.style.position='fixed';b.style.top='-'+sy+'px';b.style.left=b.style.right='0';b.style.width='100%'}else{b.style.position=b.style.top=b.style.left=b.style.right=b.style.width='';window.scrollTo({top:sy,behavior:'instant'})}}
function open(o){if(!o||$('ax').classList.contains('on'))return;$('ax').classList.add('on');lock(true);fit();if(!matchMedia('(pointer:coarse)').matches)$('ax-in').focus()}
window.openAI=function(){open(true)};
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&$('ax-ps').classList.contains('on')){pickClose();return}if(e.key==='Escape'&&$('ax').classList.contains('on')){if($('ax-sh').classList.contains('on'))sh(false);else open(false)}});
$('ax-sd').onclick=function(){send($('ax-in').value)};
$('ax-in').addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send($('ax-in').value)}});
$('ax-in').addEventListener('input',function(){this.style.height='auto';this.style.height=Math.min(this.scrollHeight,110)+'px'});
/* ===== شاشة البداية ===== */
ms.classList.add('emp');
var em=document.createElement('div');em.id='ax-em';
ms.appendChild(em);renderEmpty();renderSubj();
window.AXAPP={send:function(q){return send(q)},answer:answer};
})();
