# إعداد بحث الويب لمساعد الفيزياء

## الفكرة
الموقع يبقى على GitHub Pages، لكن مفتاح Google لا يوضع داخل ملفات الموقع. `web-search-worker.js` يعمل كوسيط آمن على Cloudflare Workers.

التدفق:

المساعد → ملازم الموقع → إذا لم يجد جواباً قوياً → Cloudflare Worker → You.com Search API → نتائج الويب → المساعد

## 1) إنشاء Google Programmable Search Engine
1. أنشئ محرك بحث Programmable Search من حساب Google.
2. اجعل البحث عاماً على الويب إذا كنت تريد نتائج من الإنترنت كله.
3. انسخ Search engine ID، وهو قيمة `cx`.
4. في Google Cloud فعّل Custom Search API وأنشئ API key.
5. قيّد المفتاح بالخدمة المطلوبة قدر الإمكان، ولا تضعه في `config.js` أو GitHub.

## 2) نشر Cloudflare Worker
1. افتح Cloudflare Dashboard ثم Workers & Pages.
2. أنشئ Worker جديد.
3. استبدل الكود بالكود الموجود في `web-search-worker.js`.
4. أضف Secrets/Variables:
   - `GOOGLE_API_KEY` = مفتاح Google API
   - `GOOGLE_CX` = Search engine ID
5. انشر الـ Worker.
6. سيكون لديك رابط مثل:
   `https://اسم-worker.اسم-حسابك.workers.dev/search`

## 3) ربطه بالموقع
افتح `config.js` وعدّل:

```js
webSearch:{enabled:true,endpoint:'https://YOUR-WORKER.workers.dev/search'}
```

لا تضع `GOOGLE_API_KEY` هنا.

## 4) سلوك المساعد بعد الربط
- سؤال موجود في الملازم → يجيب من الملازم.
- سؤال غير موجود أو الثقة منخفضة → يظهر أنه لم يجد جواباً محلياً ويبحث في الويب.
- يمكن للمستخدم الضغط على «ابحث بالويب» لإعادة البحث.
- النتائج تعرض عنوان الصفحة، المصدر، ملخصاً قصيراً، ورابطاً يفتح في تبويب جديد.
- الأسئلة العامة مثل «السرعة» أو «الضوء» تعرض خيارات توضيحية قبل البحث حتى يفهم المساعد المقصود.

## ملاحظة مهمة
هذه النسخة لا تضع مفتاح Google داخل الموقع. إذا نشرت الموقع على GitHub Pages، هذا ضروري حتى لا يصبح المفتاح مكشوفاً للزوار.
