/* الحاسبات: كل حاسبة = قانون + حقول + خطوات الحل */
(function(root){
'use strict';
const L=Math.log10,PI=Math.PI;
const fmt=(x,d)=>{if(!isFinite(x))return '—';const a=Math.abs(x);if(a!==0&&(a>=1e6||a<1e-3))return x.toExponential(d==null?3:d).replace('e+','×10^').replace('e','×10^');return String(+x.toPrecision(d==null?5:d));};
const S=[];
function add(o){S.push(o);}
/* ---------- فلك ---------- */
add({id:'parallax',s:'astro',name:'بعد النجم من زاوية اختلاف المنظر',kw:'برالاكس اختلاف المنظر بعد النجم فرسخ سنه ضوئيه وحده فلكيه parallax',
 fields:[{k:'p',l:'زاوية اختلاف المنظر p″ (ثانية قوسية)'}],
 run:v=>{const au=206265/v.p,pc=1/v.p,ly=3.26/v.p;return {steps:[
  'r(a.u) = 206265 / p″ = 206265 / '+v.p+' = '+fmt(au),
  'r(pc) = 1 / p″ = 1 / '+v.p+' = '+fmt(pc),
  'r(L.y) = 3.26 / p″ = 3.26 / '+v.p+' = '+fmt(ly)],
  answer:'البعد = '+fmt(au)+' وحدة فلكية = '+fmt(pc)+' فرسخ فلكي = '+fmt(ly)+' سنة ضوئية'};}});
add({id:'parallax_inv',s:'astro',name:'زاوية اختلاف المنظر من البعد (بالفرسخ)',kw:'برالاكس من البعد فرسخ',
 fields:[{k:'r',l:'البعد r (فرسخ فلكي)'}],
 run:v=>({steps:['p″ = 1 / r(pc) = 1 / '+v.r+' = '+fmt(1/v.r)],answer:'p″ = '+fmt(1/v.r)+' ثانية قوسية'})});
add({id:'magdiff',s:'astro',name:'فرق القدر الظاهري بين نجمين (قانون فخنر)',kw:'قدر ظاهري لمعان فخنر نجمين المع اخفت',
 fields:[{k:'m1',l:'القدر الظاهري للنجم الأول m₁'},{k:'b2b1',l:'نسبة لمعان الثاني للأول b₂/b₁'}],
 run:v=>{const d=2.5*L(v.b2b1);return {steps:['m₁ − m₂ = 2.5 log(b₂/b₁) = 2.5 × log('+v.b2b1+') = '+fmt(d),'m₂ = m₁ − '+fmt(d)+' = '+fmt(v.m1-d)],answer:'قدر النجم الثاني m₂ = '+fmt(v.m1-d)};}});
add({id:'absmag',s:'astro',name:'القدر المطلق / البعد من الأقدار',kw:'قدر مطلق بعد فرسخ M m مطلق ظاهري',
 fields:[{k:'m',l:'القدر الظاهري m'},{k:'M',l:'القدر المطلق M'}],
 run:v=>{const lr=(v.m+5-v.M)/5,r=Math.pow(10,lr);return {steps:['M = m + 5 − 5 log r','5 log r = m + 5 − M = '+v.m+' + 5 − '+v.M+' = '+fmt(v.m+5-v.M),'log r = '+fmt(lr)+' ⇒ r = '+fmt(r)+' pc','p″ = 1/r = '+fmt(1/r)],answer:'r = '+fmt(r)+' فرسخ فلكي ، p″ = '+fmt(1/r)+' ثانية قوسية'};}});
add({id:'lumin',s:'astro',name:'نورانية النجم ونصف قطره (من الأقدار البولومترية ودرجة الحرارة)',kw:'نورانيه ستيفان بولتزمان نصف قطر نجم بولومتريه درجه حراره',
 fields:[{k:'mb',l:'القدر البولومتري الظاهري m_bol'},{k:'Mb',l:'القدر البولومتري المطلق M_bol'},{k:'T',l:'درجة الحرارة الفعالة Te (كلفن)'}],
 run:v=>{const lr=(v.mb+5-v.Mb)/5,r=Math.pow(10,lr),Ls=3.8e33,Lr=Math.pow(10,(4.8-v.Mb)/2.5),Lm=Lr*Ls,sig=5.67e-5,R=Math.sqrt(Lm/(4*PI*sig*Math.pow(v.T,4)));return {steps:[
  'البعد: M_bol = m_bol + 5 − 5 log r ⇒ r = '+fmt(r)+' pc ، p″ = '+fmt(1/r),
  'النورانية: M_bol☉ − M_bol = 2.5 log(L/L☉) (M_bol☉ = 4.8) ⇒ L/L☉ = '+fmt(Lr)+' ⇒ L = '+fmt(Lm)+' erg/s',
  'نصف القطر: L = 4π σ R² Te⁴ ⇒ R = √(L / 4πσTe⁴) = '+fmt(R)+' cm = '+fmt(R/6.96e10)+' R☉'],
  answer:'r = '+fmt(r)+' pc ، L = '+fmt(Lm)+' erg/s ، R = '+fmt(R)+' cm (≈ '+fmt(R/6.96e10)+' R☉)'};}});
add({id:'kepler3',s:'astro',name:'قانون كبلر الثالث (الشمس والكوكب)',kw:'كبلر الثالث زمن الدوران نصف المحور الكبير مدار',
 fields:[{k:'a',l:'نصف المحور الكبير (وحدة فلكية) — اتركه فارغاً إن تريد حسابه',opt:1},{k:'P',l:'زمن الدوران (سنة) — اتركه فارغاً إن تريد حسابه',opt:1}],
 run:v=>{if(v.a!=null&&v.P==null){const P=Math.pow(v.a,1.5);return {steps:['P² = r³ (بوحدة سنة ووحدة فلكية)','P = √(r³) = √('+v.a+'³) = '+fmt(P)],answer:'زمن الدوران P = '+fmt(P)+' سنة'};}
  if(v.P!=null&&v.a==null){const a=Math.cbrt(v.P*v.P);return {steps:['r³ = P² ⇒ r = ∛(P²) = ∛('+v.P+'²) = '+fmt(a)],answer:'نصف المحور الكبير r = '+fmt(a)+' وحدة فلكية'};}
  throw new Error('أدخل واحدة فقط من القيمتين');}});
add({id:'binary',s:'astro',name:'كتلة نجمين في منظومة ثنائية (بدلالة كتلة الشمس)',kw:'ثنائي كتله نجمين البعد الزاوي زمن دوراني',
 fields:[{k:'al',l:'البعد الزاوي α (بنفس وحدة p)'},{k:'p',l:'زاوية اختلاف المنظر p″'},{k:'P',l:'الزمن الدوراني (سنة)'},{k:'ratio',l:'نسبة كتلة الأول للثاني (اختياري)',opt:1}],
 run:v=>{const M=Math.pow(v.al/v.p,3)/(v.P*v.P);const st=['M₁+M₂ = (α/p″)³ / P² = ('+v.al+'/'+v.p+')³ / '+v.P+'² = '+fmt(M)+' M☉'];let ans='M₁+M₂ = '+fmt(M)+' M☉';
  if(v.ratio){const M2=M/(v.ratio+1);st.push('M₁ = '+v.ratio+' M₂ ⇒ M₂ = '+fmt(M)+'/'+(v.ratio+1)+' = '+fmt(M2)+' M☉','M₁ = '+fmt(M2*v.ratio)+' M☉');ans+=' ، M₂ = '+fmt(M2)+' ، M₁ = '+fmt(M2*v.ratio);}
  return {steps:st,answer:ans};}});
add({id:'hubble',s:'astro',name:'قانون هابل: سرعة الابتعاد',kw:'هابل سرعه ابتعاد المجرات زحزحه حمراء تمدد',
 fields:[{k:'d',l:'بعد المجرة (مليون فرسخ فلكي)'},{k:'H',l:'ثابت هابل H (km/s لكل مليون فرسخ) — الافتراضي 55',def:55}],
 run:v=>({steps:['V = H × d = '+v.H+' × '+v.d+' = '+fmt(v.H*v.d)+' km/s'],answer:'سرعة الابتعاد V = '+fmt(v.H*v.d)+' km/s'})});
add({id:'oort',s:'astro',name:'سرعة جرم مجري (علاقة أورت)',kw:'اورت سرعه نصف قطريه خط الطول المجري',
 fields:[{k:'r',l:'البعد r (بالفرسخ الفلكي pc)'},{k:'L',l:'خط الطول المجري L (درجة)'},{k:'A',l:'الثابت A (km/s لكل 1000 pc) — الافتراضي 18.6',def:18.6}],
 run:v=>{const rk=v.r/1000,V=rk*v.A*Math.sin(2*v.L*PI/180);return {steps:['A معطى لكل 1000 فرسخ ⇒ نحوّل r إلى kpc: r = '+v.r+'/1000 = '+rk+' kpc','Vr = r·A·sin(2L) = '+rk+' × '+v.A+' × sin('+2*v.L+'°) = '+fmt(V)+' km/s'],answer:'Vr = '+fmt(V)+' km/s',note:'تنبيه: لو حسبتها بدون تحويل r إلى kpc (r=50 مباشرة) يطلع 465 km/s كما بملزمتك، لكن الثابت A معرّف لكل 1000 pc، فالقيمة الصحيحة وحدةً هي '+fmt(V)+' km/s. اكتب حسب طريقة أستاذك بالامتحان.'};}});
add({id:'galmass',s:'astro',name:'كتلة المجرة (بدلالة كتلة الشمس)',kw:'كتله المجره درب التبانه كبلر الثالث',
 fields:[{k:'r',l:'بعد الشمس عن مركز المجرة (سنة ضوئية) — الافتراضي 30000',def:30000},{k:'v',l:'سرعة الشمس المدارية (km/s) — الافتراضي 250',def:250}],
 run:v=>{const ly=9.46e12,au=1.496e8,rau=v.r*ly/au,P=2*PI*v.r*ly/v.v/(365.25*86400),M=Math.pow(rau,3)/(P*P);return {steps:['r = '+v.r+' ly = '+fmt(rau)+' a.u','P = 2πr/v = '+fmt(P)+' سنة','Mg = (r/A)³ / P² = '+fmt(M)+' M☉'],answer:'كتلة المجرة ≈ '+fmt(M)+' كتلة شمسية'};}});
add({id:'bode',s:'astro',name:'قاعدة بود: بعد الكوكب عن الشمس',kw:'بود بعد الكوكب عن الشمس قاعده',
 fields:[{k:'n',l:'تسلسل الكوكب n (عطارد = −∞ أي 0.4 ، الزهرة 0 ، الأرض 1 ، المريخ 2 ، الكويكبات 3 ، المشتري 4 ...)'}],
 run:v=>{const r=0.4+0.3*Math.pow(2,v.n);return {steps:['r = 0.4 + 0.3 × 2ⁿ = 0.4 + 0.3 × 2^'+v.n+' = '+fmt(r)],answer:'r = '+fmt(r)+' وحدة فلكية'};}});
add({id:'horizon',s:'astro',name:'التحويل من نظام الاستواء إلى نظام الأفق (الارتفاع والاتجاه)',kw:'نظام الافق نظام الاستواء الميل زاويه الساعه خط العرض ارتفاع زاوي الاتجاه الافقي سمت',
 fields:[{k:'d',l:'الميل δ (بالدرجات)'},{k:'f',l:'خط عرض الراصد Φ (درجات)'},{k:'H',l:'زاوية الساعة H (درجات) — إذا عندك بالساعات اضربها بـ15'}],
 run:v=>{const r=x=>x*PI/180,Z=Math.acos(Math.cos(r(v.d))*Math.cos(r(v.f))*Math.cos(r(v.H))+Math.sin(r(v.f))*Math.sin(r(v.d)))*180/PI,a=90-Z;
  const cA=(Math.sin(r(v.d))-Math.sin(r(v.f))*Math.cos(r(Z)))/(Math.cos(r(v.f))*Math.sin(r(Z)));const A=Math.acos(Math.max(-1,Math.min(1,cA)))*180/PI;return {steps:[
  'cos Z = cosδ cosΦ cosH + sinΦ sinδ ⇒ Z = '+fmt(Z,6)+'°','الارتفاع a = 90° − Z = '+fmt(a,6)+'°','cos A = (sinδ − sinΦ cos Z)/(cosΦ sin Z) = '+fmt(cA,5)+' ⇒ A = '+fmt(A,6)+'°'],
  answer:'الارتفاع الزاوي a = '+fmt(a,5)+'° ، الاتجاه الأفقي A = '+fmt(A,5)+'°',note:'الملزمة تأخذ A = cos⁻¹ مباشرة (A بين 0° و180°). إذا كان الجرم غرب خط الزوال (H بين 180°–360°) فالاتجاه الحقيقي = 360° − A.'};}});
add({id:'time',s:'astro',name:'تحويل درجات ↔ ساعات (زمن نجمي)',kw:'تحويل الدرجات الى زمن ساعه دقيقه ثانيه المطلع المستقيم',
 fields:[{k:'h',l:'ساعات',def:0},{k:'m',l:'دقائق',def:0},{k:'s',l:'ثواني',def:0}],
 run:v=>{const hh=v.h+v.m/60+v.s/3600,deg=hh*15;return {steps:['الزمن بالساعات = '+v.h+' + '+v.m+'/60 + '+v.s+'/3600 = '+fmt(hh,7)+' h','الدرجات = ساعات × 15 = '+fmt(deg,7)+'°'],answer:fmt(hh,7)+' ساعة = '+fmt(deg,7)+' درجة'};}});
add({id:'traveltime',s:'astro',name:'زمن الوصول بسرعة جزء من سرعة الضوء',kw:'سرعه الضوء زمن الوصول سنه ضوئيه مجره المراه المسلسله',
 fields:[{k:'d',l:'المسافة (سنة ضوئية)'},{k:'f',l:'السرعة كنسبة من سرعة الضوء (مثل 0.01)'}],
 run:v=>({steps:['الزمن = المسافة / السرعة = '+fmt(v.d)+' ly / ('+v.f+' c) = '+fmt(v.d/v.f)+' سنة'],answer:'الزمن = '+fmt(v.d/v.f)+' سنة'})});
add({id:'universeage',s:'astro',name:'عمر الكون من ثابت هابل',kw:'عمر الكون ثابت هابل',
 fields:[{k:'H',l:'H (km/s لكل مليون سنة ضوئية) — الافتراضي 17',def:17}],
 run:v=>{const t=9.46e18/v.H/(365.25*86400);return {steps:['1 مليون سنة ضوئية = 9.46×10¹⁸ km','العمر = 1/H = 9.46×10¹⁸ / '+v.H+' ثانية = '+fmt(t/1e9,4)+' بليون سنة'],answer:'عمر الكون ≈ '+fmt(t/1e9,4)+' بليون سنة'};}});
add({id:'drake',s:'astro',name:'معادلة الحضارات في المجرة',kw:'حياه الكون مدنيات معادله عدد الحضارات',
 fields:[{k:'ns',l:'ns (عدد النجوم) الافتراضي 2e11',def:2e11},{k:'fs',l:'fs الافتراضي 0.1',def:0.1},{k:'np',l:'np',def:1},{k:'fp',l:'fp',def:1},{k:'fi',l:'fi',def:1},{k:'fc',l:'fc الافتراضي 0.5',def:0.5},{k:'fL',l:'fL الافتراضي 1e-5',def:1e-5}],
 run:v=>{const N=v.ns*v.fs*v.np*v.fp*v.fi*v.fc*v.fL;return {steps:['N = ns·fs·np·fp·fi·fc·fL = '+fmt(N)],answer:'N ≈ '+fmt(N)+' حضارة'};}});
/* ---------- صوت / مرونة ---------- */
add({id:'young',s:'sound',name:'معامل يونغ (المرونة الخطي)',kw:'معامل يونغ يونك مرونه خطي اجهاد مطاوعه سلك استطاله',
 fields:[{k:'F',l:'القوة F (N)'},{k:'A',l:'المساحة A (m²)'},{k:'dL',l:'الاستطالة ΔL (m)'},{k:'L0',l:'الطول الأصلي L₀ (m)'}],
 run:v=>{const st=v.F/v.A,sn=v.dL/v.L0,Y=st/sn;return {steps:['الاجهاد = F/A = '+fmt(st)+' N/m²','المطاوعة = ΔL/L₀ = '+fmt(sn),'Y = الاجهاد / المطاوعة = '+fmt(Y)+' N/m²'],answer:'Y = '+fmt(Y)+' N/m² (باسكال)'};}});
add({id:'bulk',s:'sound',name:'معامل المرونة الحجمي K',kw:'معامل حجمي مرونه حجميه موائع سوائل غازات ضغط',
 fields:[{k:'dP',l:'التغير بالضغط ΔP (Pa)'},{k:'dV',l:'التغير بالحجم ΔV'},{k:'V0',l:'الحجم الأصلي V₀ (بنفس وحدة ΔV)'}],
 run:v=>{const K=v.dP/(v.dV/v.V0);return {steps:['K = ΔP / (ΔV/V₀) = '+v.dP+' / ('+v.dV+'/'+v.V0+') = '+fmt(K)],answer:'K = '+fmt(K)+' Pa (القيمة المطلقة؛ الاشارة سالبة لأن الحجم ينقص)'};}});
add({id:'shear',s:'sound',name:'معامل الصلابة (القص) n',kw:'معامل صلابه قص زاويه قصيه',
 fields:[{k:'F',l:'القوة F (N)'},{k:'A',l:'المساحة A (m²)'},{k:'al',l:'زاوية القص α (راديان)'}],
 run:v=>{const n=(v.F/v.A)/v.al;return {steps:['n = (F/A)/α = '+fmt(v.F/v.A)+' / '+v.al+' = '+fmt(n)],answer:'n = '+fmt(n)+' N/m²'};}});
add({id:'elastic_rel',s:'sound',name:'العلاقة بين Y و K و n ونسبة بويسون σ',kw:'نسبه بويسون علاقه معاملات المرونه',
 fields:[{k:'Y',l:'Y (اتركه فارغاً إن تريد حسابه)',opt:1},{k:'n',l:'n (معامل الصلابة)',opt:1},{k:'sg',l:'σ نسبة بويسون',opt:1},{k:'K',l:'K',opt:1}],
 run:v=>{const st=[];let out=[];
  if(v.n!=null&&v.sg!=null&&v.Y==null){v.Y=2*v.n*(1+v.sg);st.push('Y = 2n(1+σ) = 2×'+v.n+'×(1+'+v.sg+') = '+fmt(v.Y));out.push('Y = '+fmt(v.Y));}
  else if(v.Y!=null&&v.n!=null&&v.sg==null){v.sg=v.Y/(2*v.n)-1;st.push('σ = Y/(2n) − 1 = '+fmt(v.sg));out.push('σ = '+fmt(v.sg));}
  else if(v.Y!=null&&v.sg!=null&&v.n==null){v.n=v.Y/(2*(1+v.sg));st.push('n = Y/(2(1+σ)) = '+fmt(v.n));out.push('n = '+fmt(v.n));}
  if(v.Y!=null&&v.sg!=null&&v.K==null){v.K=v.Y/(3*(1-2*v.sg));st.push('K = Y/[3(1−2σ)] = '+fmt(v.K));out.push('K = '+fmt(v.K));}
  if(!out.length)throw new Error('أدخل قيمتين على الأقل (مثلاً n و σ)');
  return {steps:st,answer:out.join(' ، ')};}});
add({id:'debroglie',s:'sound',name:'الطول الموجي للجسيم (دي برولي)',kw:'حركه موجيه ماديه طول موجي جسيم بلانك',
 fields:[{k:'m',l:'الكتلة m (kg)'},{k:'u',l:'السرعة u (m/s)'}],
 run:v=>{const h=6.626e-34,lam=h/(v.m*v.u);return {steps:['λ = h/(mu) = 6.626×10⁻³⁴ / ('+v.m+' × '+v.u+') = '+fmt(lam)+' m'],answer:'λ = '+fmt(lam)+' m',note:'ثابت بلانك h = 6.626×10⁻³⁴ J·s (بالملزمة مكتوب 10³⁴ والصحيح أس سالب).'};}});
/* ---------- بصريات ---------- */
add({id:'snell',s:'optics',name:'قانون سنل (الانكسار)',kw:'سنل snell انكسار معامل الانكسار زاويه السقوط زاويه الانكسار',
 fields:[{k:'n1',l:'معامل انكسار الوسط الأول n₁'},{k:'t1',l:'زاوية السقوط θ₁ (درجة)'},{k:'n2',l:'معامل انكسار الوسط الثاني n₂'}],
 run:v=>{const s=v.n1*Math.sin(v.t1*PI/180)/v.n2;if(s>1)return {steps:['sin θ₂ = n₁ sinθ₁ / n₂ = '+fmt(s)+' > 1'],answer:'انعكاس كلي داخلي — لا يوجد شعاع منكسر'};const t=Math.asin(s)*180/PI;return {steps:['n₁ sin θ₁ = n₂ sin θ₂','sin θ₂ = '+v.n1+' × sin('+v.t1+'°) / '+v.n2+' = '+fmt(s),'θ₂ = '+fmt(t)+'°'],answer:'θ₂ = '+fmt(t)+'°'};}});
add({id:'critical',s:'optics',name:'الزاوية الحرجة للانعكاس الكلي',kw:'زاويه حرجه انعكاس كلي داخلي',
 fields:[{k:'n1',l:'معامل انكسار الوسط الكثيف n₁'},{k:'n2',l:'معامل انكسار الوسط الأخف n₂ (الهواء 1)',def:1}],
 run:v=>{if(v.n1<=v.n2)throw new Error('يجب أن يكون n₁ أكبر من n₂');const c=Math.asin(v.n2/v.n1)*180/PI;return {steps:['sin θc = n₂/n₁ = '+v.n2+'/'+v.n1+' = '+fmt(v.n2/v.n1),'θc = '+fmt(c)+'°'],answer:'الزاوية الحرجة = '+fmt(c)+'°'};}});
add({id:'speedmed',s:'optics',name:'سرعة الضوء في وسط وطوله الموجي',kw:'سرعه الضوء في الوسط معامل الانكسار طول موجي',
 fields:[{k:'n',l:'معامل الانكسار n'},{k:'l0',l:'الطول الموجي بالفراغ λ₀ (nm) — اختياري',opt:1}],
 run:v=>{const c=3e8,vv=c/v.n,st=['v = c/n = 3×10⁸ / '+v.n+' = '+fmt(vv)+' m/s'];let a='v = '+fmt(vv)+' m/s';if(v.l0){st.push('λₙ = λ₀/n = '+v.l0+'/'+v.n+' = '+fmt(v.l0/v.n)+' nm');a+=' ، λ داخل الوسط = '+fmt(v.l0/v.n)+' nm';}return {steps:st,answer:a};}});
add({id:'photon',s:'optics',name:'طاقة وزخم الفوتون وعددها',kw:'فوتون طاقه زخم تردد بلانك عدد الفوتونات قدره',
 fields:[{k:'f',l:'التردد f (Hz)'},{k:'P',l:'قدرة المصدر (W) — اختياري',opt:1}],
 run:v=>{const h=6.625e-34,c=3e8,E=h*v.f,p=E/c,st=['E = hf = 6.625×10⁻³⁴ × '+fmt(v.f)+' = '+fmt(E)+' J','p = E/c = '+fmt(p)+' kg·m/s'];let a='E = '+fmt(E)+' J ، p = '+fmt(p);if(v.P){st.push('عدد الفوتونات بالثانية = P/E = '+v.P+'/'+fmt(E)+' = '+fmt(v.P/E));a+=' ، N = '+fmt(v.P/E)+' فوتون/ثانية';}return {steps:st,answer:a};}});
/* ---------- مختبر ---------- */
add({id:'lab_liquid',s:'lab',name:'معامل انكسار سائل بالمرآة المقعرة (تجربة 2)',kw:'معامل انكسار السائل مرايه مقعره دبوس P1A P2A AB',
 fields:[{k:'P1A',l:'P₁A (cm)'},{k:'P2A',l:'P₂A (cm)'},{k:'AB',l:'عمق السائل AB (cm)'}],
 run:v=>{const n=(v.P1A-v.AB)/(v.P2A-v.AB);return {steps:['n = (P₁A − AB)/(P₂A − AB) = ('+v.P1A+' − '+v.AB+')/('+v.P2A+' − '+v.AB+') = '+fmt(n)],answer:'معامل انكسار السائل n = '+fmt(n)};}});
add({id:'lab_spher',s:'lab',name:'نصف قطر التكور بالأسفيرومتر (تجربة 3)',kw:'اسفيرومتر نصف قطر التكور مرايه عدسه l d',
 fields:[{k:'l',l:'المسافة بين الأرجل l (mm)'},{k:'d',l:'الفرق d = d₁ − d₀ (mm)'}],
 run:v=>{const r=v.l*v.l/(6*v.d)+v.d/2,ra=v.l*v.l/(6*v.d);return {steps:['r = l²/(6d) + d/2 = '+fmt(v.l*v.l)+'/'+fmt(6*v.d)+' + '+fmt(v.d/2)+' = '+fmt(r)+' mm','التقريب (إهمال d/2): r ≈ l²/6d = '+fmt(ra)+' mm','البعد البؤري f = r/2 = '+fmt(r/2)+' mm'],answer:'r = '+fmt(r)+' mm (≈ '+fmt(ra)+' mm بالتقريب) ، f = '+fmt(r/2)+' mm'};}});
add({id:'lab_prism',s:'lab',name:'معامل انكسار المنشور من زاوية الانحراف الصغرى (تجربة 6)',kw:'منشور زاويه الانحراف الصغرى معامل انكسار',
 fields:[{k:'A',l:'زاوية رأس المنشور A (درجة) — الافتراضي 60',def:60},{k:'dm',l:'زاوية الانحراف الصغرى δm (درجة)'}],
 run:v=>{const i=(v.A+v.dm)/2,n=Math.sin(i*PI/180)/Math.sin(v.A/2*PI/180);return {steps:['i = (A+δm)/2 = '+fmt(i)+'°','n = sin((A+δm)/2) / sin(A/2) = sin('+fmt(i)+'°)/sin('+v.A/2+'°) = '+fmt(n)],answer:'n = '+fmt(n)};}});
add({id:'lab_error',s:'lab',name:'الخطأ المئوي لنصف القطر (أسفيرومتر)',kw:'الخطا المئوي نسبه الخطا اسفيرومتر',
 fields:[{k:'el',l:'الخطأ المحتمل في l (mm)'},{k:'l',l:'l (mm)'},{k:'ed',l:'الخطأ المحتمل في d (mm)'},{k:'d',l:'d (mm)'}],
 run:v=>{const pl=v.el/v.l*100,pd=v.ed/v.d*100,pr=2*pl+pd;return {steps:['الخطأ المئوي في l = '+fmt(pl)+'%','الخطأ المئوي في d = '+fmt(pd)+'%','الخطأ المئوي في r = 2×(خطأ l) + (خطأ d) = '+fmt(pr)+'%'],answer:'الخطأ المئوي في r = '+fmt(pr)+'%'};}});
const api={list:S,fmt,byId:id=>S.find(s=>s.id===id),
 pick:(ix,q)=>{const t=root.AX?root.AX.tokens(q):[];return S.map(s=>[s,root.AX.tokens(s.name+' '+s.kw).filter(w=>t.includes(w)).length]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]).map(x=>x[0]);},
 exec:(s,raw)=>{const v={};s.fields.forEach(f=>{const x=raw[f.k];if(x===''||x==null||isNaN(+x)){if(f.def!=null)v[f.k]=f.def;else if(!f.opt)throw new Error('أكمل الحقل: '+f.l);}else v[f.k]=+x;});return s.run(v);}};
if(typeof module!=='undefined')module.exports=api;else root.AXC=api;
})(typeof window!=='undefined'?window:globalThis);
