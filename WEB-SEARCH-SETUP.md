# إعداد بحث الويب والإجابة الذكية لمساعد الفيزياء

## ما الذي تغيّر في هذه النسخة؟
- يبقى البحث الحالي `/search` كما هو.
- أُضيف ربط واجهة الموقع مع `/answer` للحصول على إجابة عربية من Groq مع المصادر.
- تعرض الواجهة الإجابة وروابط المصادر داخل بطاقة مرتبة بدل عرض JSON الخام.
- إذا تعذرت الإجابة الذكية، يرجع الموقع تلقائياً إلى عرض نتائج البحث المعتادة.
- ملف `web-search-worker.js` يتضمن نسخة Worker التي تدعم المسارين.

## إعداد الموقع
في `config.js` تأكد من وجود:
```js
webSearch:{
  enabled:true,
  endpoint:'https://physics-web-search.csxet.workers.dev/search',
  answerEndpoint:'https://physics-web-search.csxet.workers.dev/answer'
}
```

## إعداد Cloudflare Worker
الـ Worker منفصل عن ملفات الموقع؛ رفع ZIP إلى مستودع الموقع لا ينشر Worker تلقائياً.

إذا كان Worker الحالي يعمل بالفعل على `/search` و`/answer`، فلا تحتاج لإعادة نشره لمجرد رفع ملفات الموقع.
إذا احتجت نشر ملف `web-search-worker.js` يدوياً، افتح Cloudflare Dashboard ← Workers & Pages ← `physics-web-search` ← Edit code، والصق الملف ثم Deploy.

المتطلبات في Settings → Variables and Secrets:
- Secret `YDC_API_KEY`
- Secret `EXA_API_KEY`
- Secret `GROQ_API_KEY`
- KV binding اسمه `EXA_USAGE`

لا تضع قيم المفاتيح السرية داخل ملفات الموقع أو ترسلها لأحد.

## حدود الاستخدام
- Exa: حد محلي قدره 850 طلب بحث شهرياً.
- Groq: حد محلي قدره 300 إجابة يومياً.
- حدود الاستخدام هذه عدادات محلية في KV وليست حدوداً يفرضها مزود الخدمة.
