/* ===== نظام تحديد نطاق المنهج =====
   يقرر هل السؤال «داخل المنهج» أو «خارج المنهج» قبل ما يجاوب المساعد.
   لا يعدّل المحرك: يقرأ الفهرس (IX) فقط ويرجع حكماً:
     'in'     → داخل المنهج (المساعد يكمل شغله الطبيعي)
     'unsure' → قريب من المنهج بس ما لكى جواب مؤكد (نفس السلوك القديم: اقتراحات + بحث ويب)
     'out'    → خارج المنهج (يطلع كرت «خارج المنهج» وما يجاوب)
     'chat'   → سؤال عن المساعد نفسه (من أنت / كيف حالك)
   مبدأ الحكم: «خارج المنهج» لا يُحكم به إلا بدليل واضح، لأن رفض سؤال من المنهج أسوأ من
   تمريره. الأدلة: (1) قاموس مواضيع معروفة خارج الملازم، (2) غياب أي مصطلح مميّز من الملازم.
*/
(function(root){
'use strict';
var AX=root.AX;if(!AX)return;
var CFG=((root.AX_CONFIG||{}).scope)||{};
var MIN=CFG.min||2.2;        /* أقل قوة بحث تُعتبر جواباً */
var SPECIFIC=CFG.specific||12; /* أقصى عدد مواضيع يرد فيها المصطلح بعناوينها ليُعدّ من مصطلحات المنهج */
var STRONG=3;                 /* مصطلح «قوي» = يرد بعناوين ≤3 مواضيع */

/* كلمات عامة ما تدل على موضوع (أوامر وأدوات سؤال) */
var GEN={};
('قانون قوانين معادله معادلات علاقه تعريف عرف شرح اشرح بسط لخص ملخص مثال امثله حل مساله مسائل سؤال اسئله جواب '+
 'فيزياء فيزيا علم موضوع درس محاضره ملزمه فصل صفحه مادة منهج احسب اوجد جد اذكر عدد قارن فرق الفرق مقارنه '+
 'ممكن اريد ابي اعرف معلومات معلومه شي شيء اشياء شنو شلون وين ليش ليه هواي كثير قليل نوع انواع '+
 'اعطني اعط عطيني نطيني دزلي وضح وضحلي فهمني تكلم قول قلي علمني ساعدني ارجو رجاء سمحت '+
 'فلك صوت بصريات مختبر تجربه نظري عملي كيف ماذا لماذا هل اختبرني امتحني حفظيات احفظ واجب واجبات ارسم رسم '+
 'اول ثاني ثالث رابع خامس سادس سابع ثامن تاسع عاشر خواص خصايص مفاهيم اساسي اساسيه فيزيايي فيزيايه مجموعه اكتب اكتبلي سوي سويلي اسوي افضل احسن اسهل اصعب جميل مهم ممتاز عمل يعمل تعمل شغل استخدام استعمال طريقه سبب اسباب كلمه معنى رايك رايي تفكر').split(' ')
 .forEach(function(w){AX.tokens(w,true).forEach(function(t){GEN[t]=1});GEN[AX.norm(w)]=1});

/* مصطلحات من المنهج بصيغ مفردة لا تظهر بعناوين الملازم (جموع/صيغ بديلة) */
var ALIAS='كوازار كويزر نيزك شهاب مذنب كويكب سديم عنقود ثقب قزم عملاق نيوترون نيوتروني بلسار دوبلر دريك ماي رايلي سنل فرما فيرما هايغنز هيغنز يونغ هوك بويسون هابل كبلر بود مطياف حيود تداخل استقطاب عدسه مرايا مراه موشور منشور فوتون رنين صدي تردد قمر شمس كوكب نجم مجره كون مدار فلكي طيف اسفيرومتر الياف استطاره انكسار انعكاس مرونه قصور اجهاد مطاوعه موجه موجات سمت نظير بروجي استواء برالاكس فرسخ ستيفان بولتزمان هيرتزسبرنك'.split(' ');

/* ---------- قاموس خارج المنهج ----------
   x = غير فيزيائي · p = فيزياء خارج الملازم · e = كهربائية (غير مضافة بعد)
   S = كلمات مفردة لا لبس فيها · P = عبارات (تُطابق ككل) */
var LEX={
 x:{
  S:'طبخ اطبخ وصفه وصفات اكلات حلويات كيك دولمه برياني مباراه مباريات ميسي رونالدو انتخابات برلمان بورصه بيتكوين دولار دينار يورو راتب رواتب ضريبه '+
    'برمجه بايثون بايثن python javascript html css sql php كود اكواد كيمياء كيميائي كيميائيه احتراق حمض اكسده بكتيريا فيروس كورونا dna وراثه كروموسوم '+
    'فيتامين فيتامينات سرطان سكري دواء ادويه طبيب مستشفى تفاضل تكامل مشتقه لوغاريتم مصفوفه مصفوفات جبر ترجم ترجمه انكليزي انجليزي نحو اعراب قصيده '+
    'عاصمه فلم افلام مسلسل مسلسلات اغنيه اغاني بلايستيشن ببجي ايفون اندرويد لابتوب واتساب فيسبوك انستغرام تيك توك يوتيوب طقس فندق مطعم سياحه نكته نكت '+
    'ابراج صلاه زكاه فتوى حلال حرام رجيم حميه قران لاعب لاعبين هاتف موبايل',
  P:'كره القدم|كاس العالم|ريال مدريد|رئيس الوزراء|ذكاء اصطناعي|تفاعل كيميائي|تفاعلات كيميائيه|جدول دوري|تفاعل الاكسده|جهاز هضمي|جسم الانسان|ضغط الدم|'+
    'معادله تربيعيه|قواعد اللغه|حرب عالميه|مساحه دائره|محيط دائره|مساحه مثلث|مساحه مستطيل|الحمض والقاعده|كرة سلة|لاعب كره'
 },
 p:{
  S:'احتكاك عزم عزوم انتروبي انثالبي ترانزستور دايود اضمحلال شرودنغر شرودنجر هايزنبرغ برنولي ارخميدس باسكال تسارع',
  P:'قانون نيوتن|قوانين نيوتن|نيوتن الاول|نيوتن الثاني|نيوتن الثالث|قوانين الحركه|قانون الحركه|كميه الحركه|الشغل والطاقه|طاقه حركيه|طاقه كامنه|طاقه وضع|حفظ الطاقه|'+
    'السقوط الحر|حركه دائريه|قوه جاذبه مركزيه|سرعه متوسطه|سرعه لحظيه|المسافه والازاحه|معادلات الحركه|رسم السرعه والزمن|السرعه والتسارع|سياره تقطع|يقطع مسافه|تقطع مسافه|'+
    'حراره نوعيه|سعه حراريه|ديناميكا حراريه|الديناميكا الحراريه|غاز مثالي|غازات مثاليه|قانون بويل|قانون شارل|انتقال الحراره|محرك حراري|انشطار نووي|نشاط اشعاعي|عمر النصف|'+
    'ميكانيكا الكم|ميكانيكا كميه|معادله شرودنغر|معادله شرودنجر|مبدا عدم التاكد|دالة الموجه|تاثير كهروضوئي|قانون باسكال|مبدا ارخميدس|معادله برنولي|شبه موصل|بوابات منطقيه|'+
    'النسبيه الخاصه|نظريه النسبيه الخاصه|عزم الدوران|عزم القوه|عزم القصور'
 },
 e:{
  S:'كهرباء كهربائيه كهربائي كولوم كيرشوف مكثف مكثفات فولتيه امبير فاراداي شحنه شحنات مقاومه مقاومات اوم',
  P:'قانون كولوم|قانون اوم|دائره كهربائيه|تيار كهربائي|تيار متناوب|جهد كهربائي|مجال كهربائي|مجال مغناطيسي|سعه كهربائيه|محرك كهربائي|حث كهرومغناطيسي|مقاومه كهربائيه'
 }
};
var CHAT=/(^| )(شكو ماكو|شكو|شو الاخبار|شنو الاخبار|شو اخبارك|كيف الحال|هلا والله|يا هلا|عاش|تمام|اوكي|باي|مع السلامه|تصبح على خير|صباح النور|مساء النور|من انت|منو انت|شنو اسمك|ما اسمك|شنو تسوي|شلونك|كيف حالك|شخبارك|مين صنعك|مين سواك|من صنعك|ما هي مهامك|شنو تكدر تسوي|ماذا تستطيع)( |$)/;

var PRE='(?:وبال|وال|بال|كال|فال|لل|ال|و|ب|ل|ف|ك)?',SUF='(?:ات|ون|ين|ان|ها|هم|ه|ي|ا)?';
function esc(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
function rxPhrase(p){return new RegExp('(^| )'+p.split(' ').map(function(w){return PRE+esc(w)+SUF}).join(' ')+'( |$)')}
var LX={};Object.keys(LEX).forEach(function(k){
  var S={};LEX[k].S.split(' ').forEach(function(w){w=AX.norm(w);if(w)S[w]=1});
  LX[k]={S:S,P:LEX[k].P.split('|').map(function(p){p=AX.norm(p);return {p:p,re:rxPhrase(p)}})};
});

/* مصطلحات المنهج المميّزة: من عناوين المواضيع والتعاريف والقوانين والأسئلة + الأسماء البديلة */
function domain(ix){
  if(ix._dom)return ix._dom;
  var cnt={},add=function(txt,id){var seen={};AX.tokens(txt).forEach(function(w){if(!seen[w]){seen[w]=1;(cnt[w]=cnt[w]||{})[id]=1}})};
  ix.topics.forEach(function(t){add([t.kw||'',t.title,t.ch||''].join(' '),t.id)});
  ix.units.forEach(function(u){if(u.type==='def'||u.type==='law')add(u.title,u.topic.id)});
  var dom={};
  Object.keys(cnt).forEach(function(w){var c=Object.keys(cnt[w]).length;if(!GEN[w]&&w.length>1&&c<=SPECIFIC)dom[w]=c});
  ALIAS.forEach(function(a){AX.tokens(a,true).forEach(function(t){if(!GEN[t])dom[t]=1});dom[AX.norm(a)]=1});
  /* كلمات ملازم الطالب المضافة (PDF): تُعتبر من المنهج */
  var user={};ix.units.forEach(function(u){if(u.topic.s==='user')u.tok.forEach(function(w){user[w]=1})});
  ix._dom={dom:dom,user:user,hasElec:ix.topics.some(function(t){return t.s==='elec'})};
  return ix._dom;
}

/* قاموس خارج المنهج: يرجع {k,term,toks} أو null */
function lexHit(ix,n,D){
  var order=['p','x','e'],words=n.split(' ');
  for(var a=0;a<order.length;a++){
    var k=order[a];if(k==='e'&&D.hasElec)continue;
    var hit=null,P=LX[k].P;
    for(var i=0;i<P.length&&!hit;i++)if(P[i].re.test(n))hit=P[i].p;
    if(!hit)for(var j=0;j<words.length&&!hit;j++){
      var w=words[j];if(!w)continue;
      var s=w.replace(/^(وال|بال|كال|فال|لل|ال)/,'');
      if(LX[k].S[w]||LX[k].S[s])hit=w;
    }
    if(hit){
      var toks=AX.tokens(hit,true);
      /* إذا كل كلمات المصطلح موجودة بملازم الطالب المضافة → من منهجه */
      if(toks.length&&toks.every(function(t){return D.user[t]}))continue;
      return {k:k,term:hit,toks:toks};
    }
  }
  return null;
}


/* تشابه حروف ثلاثية (لتصحيح الأخطاء الإملائية بالنسبة لمصطلحات المنهج) */
function tri(w){var a={},t='#'+w+'#';for(var i=0;i<t.length-2;i++)a[t.slice(i,i+3)]=1;return a}
function dice(a,b){var n=0,x=0,y=0,k;for(k in a){x++;if(b[k])n++}for(k in b)y++;return 2*n/((x+y)||1)}
function domTri(D){if(D._tri)return D._tri;D._tri=Object.keys(D.dom).filter(function(w){return /^[\u0621-\u064A]{4,}$/.test(w)}).map(function(w){return [w,tri(w)]});return D._tri}
function lev(a,b,m){var p=[],i,j;for(j=0;j<=b.length;j++)p[j]=j;
  for(i=1;i<=a.length;i++){var c=[i],lo=i;for(j=1;j<=b.length;j++){c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));if(c[j]<lo)lo=c[j]}
    if(lo>m)return m+1;p=c}return p[b.length]}
/* قوة المصطلح: 0 = ليس من المنهج · وإلا عدد المواضيع (الأقل = أقوى) */
function termPower(ix,D,w,fixed){
  var c=[w,fixed,w.replace(/\.$/,''),(fixed||'').replace(/\.$/,'')];
  for(var i=0;i<c.length;i++){var x=c[i];if(x&&(D.dom[x]||D.user[x]))return D.dom[x]||1}
  if(/^[\u0621-\u064A]{5,}$/.test(w)){var tw=tri(w),best=0,bw=null,T=domTri(D);
    var maxEd=w.length>=7?2:1;
    for(var j=0;j<T.length;j++){var v=T[j][0];if(Math.abs(v.length-w.length)>maxEd)continue;
      if(lev(w,v,maxEd)<=maxEd)return D.dom[v]||1;
      var d=dice(tw,T[j][1]);if(d>best){best=d;bw=v}}
    if(best>=0.66)return D.dom[bw]||1}
  return 0;
}

function classify(ix,q,opt){
  opt=opt||{};
  var n=AX.norm(q),D=domain(ix);
  var out={verdict:'in',reason:'',kind:'',term:'',anchors:0,top:0};
  if(!n)return out;
  if(CHAT.test(n)){out.verdict='chat';return out}
  var lex=lexHit(ix,n,D);
  var content=AX.tokens(q).filter(function(w){return w.length>1&&!/^[\d.]+$/.test(w)&&!GEN[w]});
  var isOut=function(kind,reason,term){out.verdict='out';out.kind=kind;out.reason=reason;out.term=term||'';return out};

  if(lex){
    if(opt.lenient)return isOut(lex.k,'lex',lex.term);
    /* بقية السؤال بعد حذف مصطلح القاموس: هل فيها مصطلح مميّز من المنهج؟ (سؤال مختلط → نكمل عادي) */
    var rest=content.filter(function(w){return lex.toks.indexOf(w)<0&&termPower(ix,D,w)>0&&termPower(ix,D,w)<=STRONG});
    if(!rest.length)return isOut(lex.k,'lex',lex.term);
    out.anchors=rest.length;return out;
  }
  if(opt.lenient||!content.length)return out; /* نص الصور المشوّش أو سؤال بلا محتوى: ما نحكم */

  var fixed=AX.fixTypos(ix,content),strong=0,weak=0;
  content.forEach(function(w,i){var p=termPower(ix,D,w,fixed[i]);if(!p)return;if(p<=STRONG)strong++;else weak++});
  out.anchors=strong+weak;
  if(!out.anchors)return isOut('u','noanchor');
  var r=AX.search(ix,q,{strict:true});out.top=r.top||0;
  if(out.top<MIN){out.verdict='unsure';out.reason='weak';return out}
  /* مصطلحات عامة فقط (نجوم، حركة...) بدون تطابق بحث قوي → ما نجزم */
  if(!strong&&out.top<5){out.verdict='unsure';out.reason='weakanchor'}
  return out;
}

root.AXSCOPE={classify:classify,
  enabled:function(){return CFG.enabled!==false},
  webButton:function(){return !!CFG.webButton},
  webOnOut:function(){return CFG.webOnOut===true}};
})(typeof window!=='undefined'?window:globalThis);
