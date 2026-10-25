/* إعدادات اختيارية */
window.AX_CONFIG={
  title:'مساعد الفيزياء',
  whatsapp:'',   // مثال: '9647XXXXXXXXX' → يظهر زر "بلّغ الأستاذ" عند الفشل ويفتح واتساب والسؤال جاهز
  ocrLang:'ara+eng',
  // ضع هنا رابط الـWorker وبآخره /search مثل https://NAME.workers.dev/search
  webSearch:{
    enabled:true,
    endpoint:'https://physics-web-search.csxet.workers.dev/search',
    answerEndpoint:'https://physics-web-search.csxet.workers.dev/answer'
  },
  // نظام «خارج المنهج»: enabled=false يطفّيه · webOnOut=true يبحث بالويب تلقائياً بعد كرت خارج المنهج (الافتراضي false = كرت فقط) · webButton=true يضيف زر «ابحث بالويب» اختياري بكرت خارج المنهج · زر «وسّع بالويب» يظهر دائماً بعد أي جواب من الملازم
  scope:{enabled:true,webOnOut:false,webButton:false}
};
